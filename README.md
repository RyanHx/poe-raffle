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
## Usage

### Windows

Download and run the prebuilt installer found on the <a href="https://github.com/RyanHx/poe-raffle/releases/latest">latest release</a>.

### Mac/Linux

Follow the steps below in the Development section to get a local development copy. Then run:

```sh
npm run make
```

The installer for your OS will be found in the `/out/make/` directory.

### Raffles

1. With the program running, open the settings and point the log field to `Client.txt`, found in the `logs` folder of your PoE installation directory. If you installed the PoE standalone client in the default location, this will not need to be changed.

2. Optionally choose a keyword to listen for in your whispers.
3. Start the raffle!
4. Draw a winner!

Another winner can be drawn to reroll the result.

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
