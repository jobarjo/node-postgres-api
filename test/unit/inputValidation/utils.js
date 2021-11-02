const { assert } = require('chai');

const utils = require('../../../api/middlewares/express/request/inputValidation/utils');

const logger = {
  error: () => '',
};

describe('utils.js', () => {
  it('checkInputType', () => {
    const { checkInputType } = utils;

    const unvalidInput = [
      123,
      '',
      [],
      () => '',
    ];

    const validInput = [
      {},
      {
        test: 'test',
      },
    ];

    unvalidInput.forEach((input) => {
      try {
        checkInputType(logger)(input);
        assert.fail();
      } catch (err) {
        assert(true);
      }
    });
    validInput.forEach((input) => {
      checkInputType(logger)(input);
      assert(true);
    });
  });

  it('checkInputNotNil', () => {
    const { checkInputNotNil } = utils;

    const unvalidInput = [
      null,
      undefined,
    ];

    const validInput = [
      123,
      '',
      [],
      () => '',
      0,
      '0',
    ];

    unvalidInput.forEach((input) => {
      try {
        checkInputNotNil(logger)(input);
        assert.fail();
      } catch (err) {
        assert(true);
      }
    });
    validInput.forEach((input) => {
      checkInputNotNil(logger)(input);
      assert(true);
    });
  });

  it('checkEachInputIsExpected', () => {
    const { checkEachInputIsExpected } = utils;

    const unvalidInput = [
      {
        validation: { key: {} },
        input: { anotherKey: 'abc' },
      },
      {
        validation: { key1: {}, key2: {} },
        input: { key3: 'abc', key1: 'wqeb' },
      },
    ];

    const validInput = [
      {
        validation: { key1: {} },
        input: { key1: 'abc' },
      },
      {
        validation: { key1: {}, key2: {} },
        input: { key2: '123' },
      },
    ];

    unvalidInput.forEach(({ input, validation }) => {
      try {
        checkEachInputIsExpected(logger, validation)(input);
        assert.fail();
      } catch (err) {
        assert(true);
      }
    });
    validInput.forEach(({ input, validation }) => {
      checkEachInputIsExpected(logger, validation)(input);
      assert(true);
    });
  });

  it('checkRequiredInputIsPresent', () => {
    const { checkRequiredInputIsPresent } = utils;

    const unvalidInput = [
      {
        validation: {
          key: {
            required: true,
          },
        },
        input: { anotherKey: 'abc' },
      },
    ];

    const validInput = [
      {
        validation: {
          key2: {
            required: true,
          },
        },
        input: { key2: 'abc' },
      },
    ];

    unvalidInput.forEach(({ input, validation }) => {
      try {
        checkRequiredInputIsPresent(logger, validation)(input);
        assert.fail();
      } catch (err) {
        assert(true);
      }
    });
    validInput.forEach(({ input, validation }) => {
      checkRequiredInputIsPresent(logger, validation)(input);
      assert(true);
    });
  });

  it('validateEachInput', () => {
    const { validateEachInput } = utils;

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
      try {
        validateEachInput(logger, validation)(input);
        assert.fail();
      } catch (err) {
        assert(true);
      }
    });
    validInput.forEach(({ input, validation }) => {
      validateEachInput(logger, validation)(input);
      assert(true);
    });
  });
});
