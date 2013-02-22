var     orm  			= require('node-orm2-axomic'),
		sessionModel 	= {
                            sid:     String,
                            expires: Number,
                            json:    String
                        };

module.exports = function (connect)
{
    function PostgresStore(options)
    {
        options = options || {};
        var globalConfig = options.globals || {};
        connect.session.Store.call(this, options);

        var self = this,
            checkExpirationInterval = options.checkExpirationInterval || 1000*60*10, // default 10 minutes.
            defaultExpiration = options.defaultExpiration || 1000*60*60*24; // default 1 day.


        var initialized = true;

        function initialize(callback)
        {
           callback();
        }

        // Check periodically to clear out expired sessions.
        setInterval(function ()
        {
            orm.connect(globalConfig.databaseConnectionPostgres,
                    function(err, db){
                        var Session = db.define("session", sessionModel,
												{cache: false} );


                Session.find({expires: orm.lt(Math.round(Date.now() / 1000))})
                .remove(function (err) {
                    if(err) {
                    // console.log(err);
                    }
                });
                    });
            }, checkExpirationInterval);


        this.get = function (sid, fn)
        {
            // // console.log("getting session");
            orm.connect(globalConfig.databaseConnectionPostgres,
            function(err, db){

                var Session = db.define("session", sessionModel,
												{cache: false} );

                Session.find({sid: sid}, function (err, record)
                {
                    if(record.length > 0) {
                        var session = JSON.parse(record[0].json);
                        fn(null, session);
                    }
                    else {
                        fn();
                    }
                });

                });

        };

        this.set = function (sid, session, fn)
        {
            // console.log("setting session");
            orm.connect(globalConfig.databaseConnectionPostgres,
            function(err, db){
                var Session = db.define("session", sessionModel,
												{cache: false} );
                Session.find({sid: sid}, function (err, recordArray)
                {
                    var record;
                    var expires = session.cookie.expires ||
                      new Date(Date.now() + defaultExpiration);
                    var expirytime =  Math.round(expires.getTime() / 1000);

                    if (recordArray.length === 0)
                    {
                        record = new Session({sid: sid,
                        json: JSON.stringify(session),
                        expires: expirytime });

                        record.save(function(err) {
                            if(err) {
                               // console.log("error is");
                               // console.log(err);
                            }
                        });
                    }
                    else {
                        recordArray[0].json = JSON.stringify(session);
                        recordArray[0].expires = expirytime;
                        recordArray[0].save(function(err) {
                            if(err) {
                                   // console.log(err);
                                }
                        });

                    }
                    fn();
                });
             });
        };

        this.destroy = function (sid, fn)
        {
                orm.connect(globalConfig.databaseConnectionPostgres,
            function(err, db){
                var Session = db.define("session", sessionModel,
												{cache: false} );

                Session.find({sid: sid}).remove(function (err) {
                    // console.log(err);
                    fn && fn();
                });

            });
        };


        this.length = function (callback)
        {
           orm.connect(globalConfig.databaseConnectionPostgres,
            function(err, db){
                var Session = db.define("session", sessionModel,
												{cache: false} );


          Session.count({}, function (err, count){
                callback(count);
             });
            });
        };
        this.clear = function (callback)
        {
            // console.log("Clear ALL SESSIONS!");
        };

    }

    PostgresStore.prototype.__proto__ = connect.session.Store.prototype;

    return PostgresStore;
};
