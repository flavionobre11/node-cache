#!/bin/bash
go_root_dir() {
  cd "$(
    cd -- "$(dirname "$0")" >/dev/null 2>&1
    pwd
  )"

  cd ..
}

go_root_dir

PROTO_PATH=$PWD/tests/data/mocks/proto

rm -rf -f $PROTO_PATH/proto-types

npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=$PROTO_PATH/proto-types $PROTO_PATH/*.proto
