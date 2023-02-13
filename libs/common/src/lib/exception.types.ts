export enum ExceptionType {
  ArgumentInvalid = 'ArgumentInvalidException',
  InternalServerErrorMessage = 'An error has occurred',
  RecordNotFound = 'Record not found!',
  BadRequest = 'Bad request',
}

export enum PrismaRequestErrors {
  InternalServerErrorException = 'Something went wrong...',
}

export enum SoapRequestError {
  NotFoundRutErrorMessage = 'Rut provided not found',
}
export enum ExceptionTypeBranchOffice {
  NonExistentBrandId = 'Any of the provided brand id does not exist.',
  NonExistentServiceId = 'Any of the provided service id does not exist.',
}

export enum InternalServerError {
  message = 'Something went wrong',
}

export enum ExceptionTypeAppointment {
  AssessorNotFound = 'assessor not found',
}

export enum ExceptionTypeAppraisal {
  PatentNotFound = 'patent not found',
  BrandsNotFound = 'brands not found',
  ModelNotFound = 'model not found',
  VersionNotFound = 'version not found',
}

export enum SimulationException {
  invalidPurchaseType = 'Invalid purchase type!',
  pricesNotFound = 'priceSP, priceSC and priceCC not found!',
  conventionalCreditPricesNotFound = 'priceSP and priceCC for conventional credit not found!',
}

export enum AppointmentException {
  calendar = 'La hora',
}

export enum AppraisalException {
  notFound = 'Record not found',
}
