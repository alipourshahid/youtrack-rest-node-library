var q = require('q');
var request = require('request');
var _ = require('lodash');


module.exports = function(url, options){
    if (!url) throw new Error('Invalid YouTrack url format');
    var self = this;

    options = _.extend({
        jar: true
    }, options);

    self.request = request.defaults(options);

    self.issue = require('./issue');
    //TODO: there must be a better pattern for creating modules and passing context
    self.issue.defaults(self, url);

    self.login = function(user, pass, cb){
        var d = q.defer();
        self.request.post({url: url + '/rest/user/login', form: {login: user, password: pass}}, function(err, res, body){
            if (err || res.statusCode !== 200){
                err = err || new Error('wrong credentials');
                console.log(err);
                if (cb) return cb(err);

                return d.reject(err);
            }

            if (cb) return cb();
            d.resolve();
        });
        return d.promise;
    };

    /*
    self.timeTracking = require('./time-tracking');
    self.user = require('./user');
    self.project = require('./project');
    self.admin = require('./admin');

    self.getSearchIntelliSense = function(query, context, caret, optionsLimit){};
    self.getCommandIntelliSense = function(issueId, command, runAs, caret, optionsLimit){};
    self.getGlobalTimeTrackingSettings = function(){};
    self.getProjecttimeTrackingSettings = function(projectId){};
    self.setGlobalTimeTrackingSettings = function(daysAWeek, hoursADay){};
    self.setProjectTimeTrackingSettings = function(projectId, estimateField, timeSpentfield, enabled){};
    */
}