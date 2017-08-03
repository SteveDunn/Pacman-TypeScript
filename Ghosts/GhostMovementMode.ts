export enum GhostMovementMode {
    Undecided,

    // the ghost is chasing pacman
    Chase,
    // the ghost is heading back to his 'home corner'
    Scatter,

    // the ghost is heading back to the house (after he's been eaten)
    GoingToHouse,

    // the ghost is in the house
    InHouse,

    // the ghost is blue
    Frightened                         
}