<a name="readme-top"></a>
<!-- PROJECT LOGO -->
<div align="center">

<h1 align="center">PoE Raffle</h1>
<img src="https://i.imgur.com/uv5I25G.png" alt="Screenshot of running raffle" width="40%" height="40%">
  <p align="center">
    Run a raffle from PoE in-game chat.
    <br />
    <br />
    <a href="https://github.com/RyanHx/poe-raffle/issues">Report Bug</a>
  </p>
</div>

<!-- USAGE EXAMPLES -->
## Installation

### Windows

Download and run the prebuilt installer found on the <a href="https://github.com/RyanHx/poe-raffle/releases/latest">latest release</a>.

### Mac/Linux

Follow the steps below in the Development section to get a local development copy. Then run:

```sh
npm run make
```

The installer for your OS will be found in the `/out/make/` directory.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Raffles

1. Optionally choose a keyword to listen for in your whispers.
2. Start the raffle.
3. Draw a winner!

The winner's character name will be copied to the clipboard so you can message them immediately.

Another winner can be drawn to reroll the result.

If you are notified the app can't locate PoE's log file (e.g. you installed PoE in a non-default location), open the settings and point the log field to `<PoE installation folder>/logs/Client.txt`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Development

To get a local copy up and running follow these simple steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/RyanHx/poe-raffle.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Bootstrap](https://getbootstrap.com/)
* [poe-log-events](https://www.npmjs.com/package/poe-log-events)
* [tsParticles Confetti](https://confetti.js.org/more.html)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
