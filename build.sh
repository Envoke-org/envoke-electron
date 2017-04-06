#!/bin/bash

read -p "Enter path: " path

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

electron-packager . envoke-electron --platform=darwin --icon="$DIR/static/images/app-icon.icns" --out=$path --overwrite
