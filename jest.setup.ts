import '@testing-library/jest-dom'

// next-intl ships as ESM and cannot be transformed by jest. Apply the manual
// mock in __mocks__/next-intl.js globally so every suite uses the same
// namespace-aware translator. Individual tests must not redefine this mock.
jest.mock('next-intl')
