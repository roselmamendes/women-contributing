require ('../database');
var User = require ('../models/user');

afterEach(function () {
  User.remove({}, function() {
    });
});

describe("UserTime", function() {
  it("should get user count grouped by time", function (done) {
    var qty = 0;
    runs(function (){
      new User({"created_at" : "2014-01-01"}).save();
      new User({"created_at" : "2014-02-01"}).save();
      new User({"created_at" : "2014-03-01"}).save();
    });

    waitsFor(function(){
            User.byTime(function (users){
                                        qty = users.length;
                        });
            return qty == 3;
    },10000);

    User.byTime(function (users) {
              expect(users).toEqual([ { _id: { year: 2014, month: 1 }, count: 1 },
                                      { _id: { year: 2014, month: 2 }, count: 1 },
                                      { _id: { year: 2014, month: 3 }, count: 1 } ]);
              done();
                });
  });
});

describe("UserGender", function() {
  it("should get user grouped by gender", function (done) {
    new User({"gender" : "female"}).save();
    new User({"gender" : "male"}).save();
    User.byGender(function (users) {
      var captured = null;
      try {
        expect(users.length).toEqual(2);
        expect(users).containsAll([ { _id:  "female", count: 1 },
                                  { _id:  "male" , count: 1 }]);
      } catch(e) {
        captured = e;
      }
      expect(captured).toBe(null);
      done();
    });
  });
});
