/// <reference path="./interfaces.d.ts"/>
/// <reference path="./../source/ts/app.ts"/>
describe('when started', function () {
    it('jquery exists', function () {
        expect($).to.exist;
    });
    it('Q exists', function () {
        expect(Q).to.exist;
    });
    it('expect bat1.eat to be undefined', function () {
        expect(bat1.eat).not.to.exist;
    });
});
