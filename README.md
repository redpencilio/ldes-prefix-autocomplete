# Distributed prefix autocomplete

This Ember application provides an approach to query and provide autocomplete over a remote fragmented prefix tree dataset following the TREE/LDES specifications.
This document also includes a section on how to host a fragmented prefix tree dataset on your own IPFS node and query over it using this application.

## Setting up and running the Ember application

The required libraries should first be installed using `npm install`. The ember application can be executed by running the `npm start` script.

The Ember app provides you with an interface in which you can:

- enter the endpoint you want to query
- select the extension of the files if using a static file server
- enter a search query to get autocomplete suggestions

When querying an endpoint which doesn't require to include the file extension in the requests, you can simply leave the extension dropdown on 'No extension'.

## Generating a fragmented prefix tree dataset

https://github.com/redpencilio/ldes-time-fragmenter/tree/feature/docs includes a CLI tool which can be used to generate fragmented versions of a dataset. It includes the option to generate a prefix-tree based fragmentation.
Do note: the Ember app currently expects that the resources contain a predicate https://example.org/name and that the different prefix relations are defined on the path https://example.org/name.

## Querying files stored on an IPFS node

This application is able to query over any type of endpoint which can provide an RDF representation of a fragmented prefix-tree dataset. This includes datasets stored on IPFS endpoints.

Using the go-ipfs package (https://github.com/ipfs/go-ipfs#install). You can set up an IPFS node using the `ipfs daemon` command.
Once you have your node up and running, you can add a local folder to your node by running `ipfs add -r <folder_name>`. This provides you with a hash which you can use to locate the folder like so: `https://gateway.ipfs.io/ipfs/<hash>`. When querying a dataset on IPFS, do not forget to include the right extension in the interface.
