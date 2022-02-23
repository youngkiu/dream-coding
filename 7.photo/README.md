
### Before running program

```
└── test_files
    ├── IMG_1234.jpg
    ├── IMG_2345.jpg
    ├── IMG_E1234.jpg
    ├── a.mp4
    ├── b.mov
    ├── captured.png
    └── randome.aae
```

## Run program
```
$ node app.js -p test_files
```

### After running program

```
└── test_files
    ├── IMG_2345.jpg
    ├── IMG_E1234.jpg
    ├── captured
    │   ├── captured.png
    │   └── randome.aae
    ├── duplicated
    │   └── IMG_1234.jpg
    └── video
        ├── a.mp4
        └── b.mov
```