const { assert } = require('chai');
const { v4: uuidv4 } = require('uuid');

const validators = require('../../../api/middlewares/express/request/inputValidation/validators');

describe('validators.js', () => {
  it('should validate uuid', () => {
    const { uuid } = validators;

    const unvalidInput = [
      123,
      '',
      [],
      {},
      () => '736c4430-176f-43bd-afa0-c0c92a92bceb',
      '736c4430-176f-43bd-afa0-c0c92a92b!!!',
      '736c4430-736c4430',
    ];

    const validInput = [
      uuidv4(),
      '736c4430-176f-43bd-afa0-c0c92a92bceb',
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(uuid(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(uuid(input));
    });
  });

  it('should validate password', () => {
    const { password } = validators;

    const unvalidInput = [
      123,
      '',
      [],
      {},
      () => '',
      '123456789',
      'abcdefghijk',
      '12345abcde',
      '12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde',
    ];

    const validInput = [
      '123456OwW!',
      '!!!!!!1w',
      '!!!!!!1w!!!!!1w!!!!!1w!!!!!1w',
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(password(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(password(input));
    });
  });

  it('should validate role', () => {
    const { role } = validators;

    const unvalidInput = [
      123,
      '',
      [],
      {},
      () => '',
      'not_a_role',
      '123144',
    ];

    const validInput = [
      'ADMIN',
      'BASIC',
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(role(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(role(input));
    });
  });

  it('should validate ', () => {
    const { max64Length } = validators;

    const unvalidInput = [
      123,
      '',
      [],
      {},
      () => '',
      'abeccwefwefwefabeccwefwefwefabeccwefwefwefabeccwefwefwefabeccwefwefwefabeccwefwefwef',
      1234567890123456789012345678901234567890123456789012345678901234567890,
    ];

    const validInput = [
      '1234',
      'qweqf ac qd',
      '12k (*( "Edowdoj',
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(max64Length(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(max64Length(input));
    });
  });

  it('should validate max255Length', () => {
    const { max255Length } = validators;

    const unvalidInput = [
      123,
      '',
      [],
      {},
      () => '',
      '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    ];

    const validInput = [
      '1234',
      'qweqf ac qd',
      '12k (*( "Edowdoj',
      'abeccwefwefwefabeccwefwefwefabeccwefwefwefabeccwefwefwefabeccwefwefwefabeccwefwefwef',
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(max255Length(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(max255Length(input));
    });
  });

  it('should validate max255LengthMin0', () => {
    const { max255LengthMin0 } = validators;

    const unvalidInput = [
      123,
      [],
      {},
      () => '',
    ];

    const validInput = [
      '',
      '123123',
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(max255LengthMin0(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(max255LengthMin0(input));
    });
  });

  it('should validate max255LengthMin0', () => {
    const { email } = validators;

    const unvalidInput = [
      123,
      '',
      [],
      {},
      () => '',
      'asdasc@qw',
      'qw.com',
    ];

    const validInput = [
      'qweqw@test.com',
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(email(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(email(input));
    });
  });

  it('should validate gmtDiff', () => {
    const { gmtDiff } = validators;

    const unvalidInput = [
      123,
      '',
      [],
      {},
      () => '',
      '1',
      1.2,
    ];

    const validInput = [
      1,
      10,
      0,
      -3,
      14,
      12,
    ];

    unvalidInput.forEach((input) => {
      assert.isFalse(gmtDiff(input));
    });
    validInput.forEach((input) => {
      assert.isTrue(gmtDiff(input));
    });
  });
});
