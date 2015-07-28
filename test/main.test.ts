/// <reference path="./interfaces.d.ts"/>
/// <reference path="./../source/ts/app.ts"/>

describe('when started', () => {
  it('jquery exists', () => {
    expect($).to.exist;
  });

  it('Q exists', () => {
    expect(Q).to.exist;
  });

  it('expect bat1.eat to be undefined', () => {
    expect(bat1.eat).not.to.exist;
  });
});
