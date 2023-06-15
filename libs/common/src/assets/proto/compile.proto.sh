protoc \
--plugin=../../../../../node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=../../../../../apps/websocket-app/src/app/domain/connections/proto-gen/ service.proto \
--ts_proto_opt=outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false
