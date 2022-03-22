# Pacman

Pacman. Written in TypeScript.  [Play it now, if you like](https://pacman.azureedge.net/)

<p align="center">
  <img src="doc/screenshot1.png" alt="Screenshot"/>
</p>

The goal of this project was to learn TypeScript.  I never intended
releasing the source code, but a few people asked for it, so here it is.  Please go easy on me, it's my first go!

Technical overview [here](http://blog.dunnhq.com/index.php/2017/08/03/pacman-dissected/)

Game overview [here](http://blog.dunnhq.com/index.php/2017/07/13/learning-typescript-by-writing-a-game/)

## License
GNU GENERAL PUBLIC LICENSE Version 3 [#](LICENSE.txt)

## Donations
If you found this project helpful, or if the source code was useful (or you found it caused much hilarity), or even if you just enjoyed playing the game,
then feel free to donating a small amount to [charity](https://www.justgiving.com/fundraising/steve-dunn7).

## Project Layout

### Folders
#### Core
This folder contains core items that aren't specific to Pacman.  Things like
Canvas, Sprite, timers, and fundamental types such as Point and Rect.

#### Game
Game specific types, such as GameStats, PlayerStats, Tile, Fruit, and PacMan.

#### Ghosts
Ghost specific types, such as Inky, Pinky, Blink & Clyde.  Also contains the logic
for moving the ghosts.

#### Scenes
Cut-scene specific types.


