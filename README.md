# insomnia-plugin-fluree-sign

A plugin for use with the Insomnia API development application

## Installation

1. Clone this repo to your [Insomnia `plugins` folder](https://docs.insomnia.rest/insomnia/introduction-to-plugins#plugin-file-location) 
1. `cd insomnia-plugin-fluree-sign && npm install` to install the dependencies.
1. In Insomnia's settings modal, under the "Plugins" tab, click the "Reload Plugins" button

## Usage

Copy the public & private keys for the `_auth` record you would like to sign with into the environment variables `FLUREE_PUBLIC_KEY` and `FLUREE_PRIVATE_KEY`, respectively. If you would like a verbose response from signed transactions, set the `VERBOSE_TX` environment variable to `true`.

Current usage is restricted to the `query` and `command` endpoints. Any other endpoints will not trigger the plugin.

## Development Notes

This plugin has only been tested on a _local_ Fluree ledger so far.
