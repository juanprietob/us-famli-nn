# us-famli-nn

> Prediction models for the Ultrasound Fetal Age Machine Learning Initiative

## Install

```bash
npm install git@github.com:juanprietob/us-famli-nn.git
```

## Usage in the command line

```bash
us-famli-nn --help
```

```
Help: Run prediction in the ultrasound images
Required:
--img <input path to image>
--type <prediction type>
--out <output filename>
```

```bash
us-famli-nn --img /path/to/input.nii --type 'remove-calipers' --out temp.nrrd 
```

## License

MIT © [juanprietob](https://github.com/juanprietob)
