import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export const ApiCommonResponse = (obj: any) => {
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
