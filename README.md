# rosave_extension
allows you to save robux purchasing items, or donate some of the price to another user.

The actual code is in the extension folder, everything outside of it isn't directly part of the extension such as defaults.

#values.json
This file contains values loaded when the extension starts.
devDonateId is the place id used if the option to donate to the developer is selected.
The savings object contains the amount saved for each item type, multiplied with the expected price.
{
    "devDonateId": 10921698148,
    "savings": {
        "layeredClothing": 0.4,
        "classicClothing": 0.1,
        "accessories": 0.4,
        "passes": 0.1,
        "plugins": 0.1,
        "bundles": 0.4,
        "classicHeads":0.4,
        "classicFaces":0.4
    }
}
