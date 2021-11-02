const { assert } = require('chai');

const verifyInput = require('../../../api/middlewares/express/request/inputValidation/verifyInput');

const logger = {
  error: () => '',
};
const res = {};
const next = () => '';

describe('verifyInput.js', () => {
  it('should verify', () => {
    const unvalidInput = [
      {
        validation: {
          key: {
            required: true,
            validator: (x) => x === 1,
          },
        },
        input: { key: 2 },
      },
      {
        validation: {
          key: {
            required: true,
            allowNull: false,
            validator: (x) => x === 1,
          },
        },
        input: { key: null },
      },
    ];

    const validInput = [
      {
        validation: {
          key: {
            required: true,
            allowNull: true,
            validator: (x) => x === 1,
          },
        },
        input: { key: null },
      },
      {
        validation: {
          key: {
            required: true,
            validator: (x) => x === 1,
          },
        },
        input: { key: 1 },
      },
    ];

    unvalidInput.forEach(({ input, validation }) => {
      const req = {
        locals: {
          validationData: {
            inputToValidate: input,
            inputValidators: validation,
          },
          logger,
        },
      };

      try {
        verifyInput(req, res, next);
        assert.fail();
      } catch (err) {
        assert(true);
      }
    });
    validInput.forEach(({ input, validation }) => {
      const req = {
        locals: {
          validationData: {
            inputToValidate: input,
            inputValidators: validation,
          },
          logger,
        },
      };

      verifyInput(req, res, next);
      assert(true);
    });
  });
});
