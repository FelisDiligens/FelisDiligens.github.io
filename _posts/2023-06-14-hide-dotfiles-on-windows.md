---
title: "Hide dotfiles on Windows"
layout: post
tags: windows
comments: true
---

<figure>
    <img src="/assets/posts/all-those-folders.png">
    <figcaption style="font-size: 11pt; font-style: italic;">The mess that is the home folder on Windows</figcaption>
</figure>

_(though, to be fair, the home folder on Linux looks similar if you show the hidden folders...)_

A lot of developers simply put dot files and folders into the home folder on Windows without adding the NTFS hidden attribute, resulting in an absolute mess as you can see in the screenshot.
Dot files and folders aren't hidden on Windows, but developers just gladly ignore this fact, it seems.

Some background:

> In Linux, and other UNIX like systems, a file with a name that starts by a dot (`.`) is considered a _hidden file_. Some file managers also hide files that end with a tilde (`~`), which are considered _backup files_. <sup>[Source](https://github.com/brunonova/nautilus-hide)</sup> Typically files ending with a `~` are created by editors like emacs, nano, or vi. <sup>[Source](https://unix.stackexchange.com/a/76192)</sup>

> If you create the file _.hidden_ in a directory in which you want to hide files or folders and enter the names of files or folders there without specifying the path, they will not be displayed in the file manager. <sup>[Source](https://wiki.ubuntuusers.de/Versteckte_Dateien/)</sup>

## A little python script

I wrote a little python script to have a tidy home folder once again.

You may want to check it out: [Gist: FelisDiligens/hide-files.py](https://gist.github.com/FelisDiligens/9886ede399e3a321797b43ab53a371f9)  
(I added a comment below the gist to explain usage)

The python script looks into each given directory (`%USERPROFILE%` or `~` by default) and add the NTFS hidden attribute to every file and folder that starts with a `.`.
As a bonus, it also reads `.hidden` files inside of directories and hides whatever entries are written in it.

However, it does not run on it's own and it does not scan the entire disk (only given directories).
You have to do that manually or setup some service or a cron job to run it periodically.

Thankfully, you can setup a cron job using Cygwin, see below.


## Run Cronjobs under Windows

[Cygwin](https://www.cygwin.com/) can be used to create a Windows service that runs the [cron](https://en.wikipedia.org/wiki/Cron) daemon.

First, you have to install `cygrunsrv` and `cron` using the Cygwin installer. (You can simply rerun it, if you already installed Cygwin)

![](/assets/posts/cygwin-installer-cygrunsrv.png)

> ℹ️  `cygrunsrv` can be used to add daemons as a Windows service

Then start an elevated bash shell (or use gsudo) to run:
```bash
cygrunsrv -I cron -p /usr/sbin/cron -a -n
```

Arguments breakdown:
- `-I <svc_name>`: install a Windows service
- `-p <app_path>`: path to POSIX program
- `-a <args>`: arguments for POSIX program
	- `cron -n`: make cron run in the foreground

You can then do the following (some may need to be run as admin):
- Query `cron` status: `cygrunsrv --query cron`
- Start `cron`: `cygrunsrv --start cron`
- Stop `cron`: `cygrunsrv --stop cron`
- Remove `cron` daemon: `cygrunsrv -R cron`

Afterwards, you can setup cronjobs using `crontab -e` just like you're used to.

The cron daemon will start automatically when you boot Windows and log in.

To then make use of the script, I added this:

```
*/10 * * * * /cygdrive/c/Users/[redacted]/AppData/Local/Programs/Python/Python311/python "C:\Users\[redacted]\Scripts\hide-files.py" "C:\Users\[redacted]" "D:\\" "E:\\" -d 2
```

The above states that every 10 minutes, it will run `python.exe hide-files.py` with a few arguments.

## Use `Ctrl+H` in Windows Explorer

There are a few hotkeys that I wish would just work under Windows.
For example, under Linux I can use `Ctrl+H` to toggle hidden entries. This works with Nautilus, Dolphin, Nemo, Thunar, and many other popular Linux file managers. But not in Windows Explorer.

For this, I've found that a little dabbling with AutoHotkey can help a lot.

If you don't know [AutoHotkey](https://www.autohotkey.com/),
it is a free, open-source scripting language for Windows that essentially allows you to make complex macros.
(But this only scratches the surface)

Here's an excerpt from my AutoHotkey script:
```ahk
; Ctrl+H to toggle hidden files
; Hide/Show hidden files in Windows file explorer
^h::
If WinExist("ahk_exe Explorer.EXE") && WinActive("ahk_exe Explorer.EXE")
{
	; Toggle registry entry
	RegRead, HiddenVal, HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced, Hidden
	If HiddenVal = 2
	{
		RegWrite, REG_DWORD, HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced, Hidden, 1
	}
	Else
	{
		RegWrite, REG_DWORD, HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced, Hidden, 2
	}
	; Refresh window
	Send ^{F5}
}
Return
```

What it does:
- When you press `Ctrl+H` (see `^h::`)...
  - then check if `Explorer.EXE` is running and is the active window. If that's the case:
    - read the registry value `Hidden` in the key `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced` and write the result into the ahk variable `HiddenVal`
    - toggle the registry value with the help of `HiddenVal`
    - send `F5` to refresh the file explorer

You can simply copy and paste it into a file with the `.ahk` extension and double-click it. You can also compile it into an `.exe` file for portable use.


## Further reading

There's actually a project on GitHub that uses DLL injection to hide dotfiles.  
You may want to check this out: [github.com/joshumax/WinHideEx](https://github.com/joshumax/WinHideEx)

If found reading this part quite amusing, as this is what I've been doing (and explaining in this article):
> Yes, I'm aware that you can manually mark all of them with the "hidden" attribute but it's like playing NTFS whack-a-mole with a filesystem watcher script. 

So, if you're interested in a different (and perhaps more elegant) solution, give WinHideEx a try.