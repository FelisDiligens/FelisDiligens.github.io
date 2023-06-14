---
title: "Make Windows behave more like Linux"
layout: post
tags: windows
comments: true
---

If you're anything like me, you'll find yourself frustrated whenever you have to boot up Windows.

The goal of this post is to show you how to make Windows just a bit more comfortable to a Linux user.

# The basics

## Install a package manager

<figure>
    <img src="/assets/posts/shell-package-manager.png">
    <figcaption style="font-size: 11pt; font-style: italic;">When you like bash and package managers under Linux but have to use Windows...</figcaption>
</figure>

There are various package managers available for Windows. My favorite is Chocolatey.

| Package manager                                                      | License                              | Recommendation/Description                                                                                                                                                                      |
| -------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Chocolatey](https://community.chocolatey.org/)                      | Partially open source (Apache v2)    | best for GUI apps / bigger programs                                                                                                                                                             |
| [scoop](https://scoop.sh/)                                           | Fully open source (Unlicense or MIT) | best for single executable CLI tools (doesn't pollute PATH as much)                                                                                                                             |
| [winget](https://learn.microsoft.com/en-us/windows/package-manager/) | CLI released under MIT               | the official Windows package manager (based on [appget](https://keivan.io/the-day-appget-died/), which was [eee'd](https://en.wikipedia.org/wiki/Embrace,_extend,_and_extinguish) by Microsoft) |

_([Find packages for winget](https://winget.run/))_

### Chocolatey

<img src="/assets/posts/chocolatey.svg" width="96">

To install Chocolatey, run in an elevated PowerShell window:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iwr https://community.chocolatey.org/install.ps1 -UseBasicParsing | iex
```
See: [docs.chocolatey.org/en-us/choco/setup](https://docs.chocolatey.org/en-us/choco/setup#install-from-powershell-v3)


The usage of Chocolatey is very similar to `apt` or `dnf` under Linux.

| Do                   | Command                     |
| -------------------- | --------------------------- |
| Installation:        | `choco install PACKAGES -y` |
| Update all packages: | `choco upgrade all -y`      |
| Show info:           | `choco info PACKAGE`        |
| Available updates:   | `choco outdated`            |
| List installed apps: | `choco list --local-only`   |

> Note: You have to execute choco with admin privilages. Thankfully there is a sudo equivalent, see below.

## Getting a proper shell

There are a lot of different options here for Windows. WSL, Cygwin, Git Bash, PowerShell.

PowerShell is already installed and can be configured to behave more like Bash.

### PowerShell

<img src="/assets/posts/powershell.svg" width="96">

#### Configure hotkeys

If you'd like to just use PowerShell, you may be disappointed at first if you try various hotkeys.

To remedy this, first (if you're using Windows PowerShell) install a newer version of PSReadLine (run as admin):
```powershell
Install-Module -Name PowerShellGet -Force
Install-Module PSReadLine -AllowPrerelease -Force
```

Then, add to your PowerShell profile:

> To edit your profile, enter in PowerShell: `notepad $profile`  
> Replace `notepad` with your favorite editor.

```powershell
# Ctrl+D to exit, Ctrl+L to clear screen, and more. Like in bash <3
Set-PSReadlineOption -EditMode Emacs

# Use Ctrl <- and -> to jump words
# See https://github.com/PowerShell/PowerShell/issues/3038
Set-PSReadLineKeyHandler -Chord Ctrl+LeftArrow BackwardWord
Set-PSReadLineKeyHandler -Chord Ctrl+RightArrow ForwardWord

# Tab completion like in fish <3
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
```

After restarting your PowerShell prompt, the changes should have been applied.

#### Skip welcome message

To skip the welcome message, run `powershell.exe` with the argument `-NoLogo`.


### Bash

<img src="/assets/posts/bash.svg" width="96">

If you'd like to use Bash on Windows, I'd recommend [Cygwin](https://www.cygwin.com/) over WSL. It's way less bloated and runs natively.


## Installing GNU Tools

<img src="/assets/posts/gnu.png" width="96">

What's a shell without tools? Since Windows doesn't come with tools like `grep`, `sed`, `awk`, `tail`, and so on, you'll have to install ports from somewhere.

Here are some sources:
- [Cygwin](https://www.cygwin.com/): I'd recommend Cygwin, as it has a large repository of GNU and unix-y tools.
- Git Bash: If you install [Git for Windows](https://git-scm.com/download/win), it will come with a few of the basic GNU tools.
- [MSYS2](https://www.msys2.org/#installation): a fork of Cygwin that focuses on being as native to win32 as possible.
- [BusyBox](https://frippery.org/busybox/): An alternative to GNU Tools
- [GnuWin32](https://gnuwin32.sourceforge.net/): port of GNU Tools for Windows (unmaintained!)

If you won't be using Cygwin Bash, then MSYS2 is preferable.

## Installing gsudo

[gsudo](https://gerardog.github.io/gsudo/) is a `sudo` equivalent for Windows, with a similar user-experience as the original Unix/Linux sudo.

You can install it through your typical package managers:
- `scoop install gsudo`
- `choco install gsudo`
- `winget install gerardog.gsudo`

See: [github.com/gerardog/gsudo](https://github.com/gerardog/gsudo#installation)


## Installing a proper terminal emulator

I think, the MSYS2 docs do a good job of displaying the various options: [msys2.org/docs/terminals/](https://www.msys2.org/docs/terminals/)

I'll add my two cents here:

### mintty
![](https://www.msys2.org/docs/mintty.png)

mintty is the default terminal of Cygwin, Git Bash, and MSYS2.  
It is quite customizable, but also lacks some features, such as tabs.  
Still, this is a solid choice for minimalists.

### Windows Terminal
![](https://www.msys2.org/docs/winterm.png)

The official terminal by Microsoft, which is preinstalled on Windows 11.
It is very customizable and has features such as profiles and tabs.

Easily installable through the [Microsoft Store](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701).

This is my favorite.

### More?
Of course:

- [Alacritty](https://alacritty.org/)
- [Konsole by KDE](https://konsole.kde.org/)
- [Cmder](https://cmder.app/)
- any many more...

# Going deeper

I have a few more articles on this topic that go a little deeper, if you want to check them out:
- [Hide dotfiles on Windows](hide-dotfiles-on-windows.html)

(I'll keep this updated when I'm adding more)


# Conclusion

Windows will obviously never behave just like Linux.
However there is no reason why we wouldn't want to make it a bit more comfortable.

I hope this article helped you at least a bit.

Also, if you're interested, you can look into my dotfiles for inspiration: [My dotfiles](https://github.com/FelisDiligens/dotfiles)

<!--
Leave a comment if you have any more suggestions! <3
-->