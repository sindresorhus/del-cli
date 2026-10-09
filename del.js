#!/usr/bin/env node
// The `del` bin must point to a different file than the `del-cli` bin. Otherwise, `npm exec -- del-cli` can run the `del` bin, which on Windows runs the built-in `del` command instead.
import './cli.js'; // eslint-disable-line import-x/no-unassigned-import
