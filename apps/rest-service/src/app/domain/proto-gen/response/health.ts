/* eslint-disable */

export const protobufPackage = "health.response.types";

export interface HealthCheckResponse {
  status: HealthCheckResponse_ServingStatus;
}

export enum HealthCheckResponse_ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
  SERVICE_UNKNOWN = 3,
  UNRECOGNIZED = -1,
}
