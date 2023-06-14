#!/bin/bash

export GEM_HOME="$HOME/.gem"

if [ -n "$1" ] && [ "$1" = "install" ]; then
    # install ruby
    if ! [ -x "$(command -v gem)" ]; then
        if [ -x "$(command -v dnf)" ]; then
            sudo dnf install ruby ruby-devel # there might be things missing
        elif [ -x "$(command -v apt)" ]; then
            # sudo apt install ruby ruby-dev ruby-bundler
            # sudo apt-get install ruby-full build-essential zlib1g-dev
            sudo apt-get install ruby ruby-dev ruby-full build-essential zlib1g-dev
        elif [ -x "$(command -v choco)" ]; then
            choco install ruby # header files might be missing ?
            # https://rubyinstaller.org/downloads/
        else
            echo "Unknown system. Please install Ruby manually and ensure that 'gem' is on PATH."
            exit -1
        fi
    fi

    # install dependencies
    if ! [ -x "$(command -v bundle)" ]; then
        gem install bundler
    fi
    gem install jekyll

    # install project
    bundle install

elif [ -n "$1" ] && [ "$1" = "server" ]; then
    # preview locally
    bundle exec jekyll serve

elif [ -n "$1" ] && [ "$1" = "new-post" ]; then
    mkdir -p "_posts"
    touch "_posts/$(date +%Y-%m-%d)-$2.md"
    echo "Created _posts/$(date +%Y-%m-%d)-$2.md"

elif [ -n "$1" ] && [ "$1" = "new-tag" ]; then
    mkdir -p "tags"
    printf "---\nlayout: tags\ntag-name: $2\n---" > "tags/$2.md"
    echo "Created tags/$2.md"

else
    # compile
    bundle

fi