# DateTime scripts

## Generate tzdata

```
./bin/generate-tzdata --version <version> --output <output_dir>
```

## Generate test cases

All timezones:

```
./bin/generate-test-cases --tzdata <tzdata_root_dir> --version <version> --output <output_dir>
```

Specific timezone:

```
./bin/generate-test-cases --tzdata <tzdata_root_dir> --version <version> --output <output_dir> --timezone <timezone>
```


```
./bin/generate-test-cases --tzdata ./out/tzdata/ --version 2017a --output ./out-test --timezone Europe/Moscow
```
