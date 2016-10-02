# You're totally my type <3

Overall flow of information.
Input modifies the game state. View draws based on game state.

All

## InputFactory
Only factory that has Socket injected.
Attaches key listener to window.  On keypress, emit socket event out.
On event keypress event inbound, modfies game state.

## PlayerFactory
Most of the 'game state'.
Injected into other factories, and controller to R/W game state.

## DisplayFactory
Uses information in game state to

## Events
### From server:
eveSrvKey
### From client:
eveClnKey
