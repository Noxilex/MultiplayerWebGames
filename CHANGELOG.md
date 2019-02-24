changelog.# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased] - 2019-02-24

### Added
- Table layout
- Image support
- Client/Server communication
- Pieces movement rules (simple movement for normal pieces, loop for infinite movement pieces like rook or bishop)
- Removes selection when you click away or on the current selected piece

### Changed 
- Rename game_two folder to shogi
- Adapted the api to redirect to the shogi game when requesting game/shogi instead of game/2