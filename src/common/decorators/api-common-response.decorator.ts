import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ApiCommonResponse = (
  obj: Record<string, SchemaObject | ReferenceObject>,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          data: {
            properties: {
              ...obj,
            },
          },
        },
      },
    }),
  );
};
