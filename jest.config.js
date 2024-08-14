// fix for ReferenceError: TextEncoder is not defined jest
// we probably can remove this once we remove enzyme
// build was failing here
// https://github.com/cfpb/ccdb5-ui/actions/runs/10391052214/job/28775102128?pr=526
// https://stackoverflow.com/a/69734807/659014
module.exports = {
  testEnvironment: 'node',
};
