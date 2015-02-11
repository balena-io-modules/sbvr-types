(function() {
  var __hasProp = {}.hasOwnProperty;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['lodash', 'bluebird'], function(_, Promise) {
        return (root.SBVRTypes = factory(_, Promise));
      });
    } else if (typeof exports === 'object') {
      return module.exports = factory(require('lodash'), require('bluebird'));
    } else {
      return root.SBVRTypes = factory(_, Promise);
    }
  })(this, function(_, Promise) {
    var TypeUtils;
    TypeUtils = (function() {
      var equality;
      equality = function(from, to) {
        return ['Equals', from, to];
      };
      return {
        nativeFactTypeTemplates: {
          equality: {
            'is equal to': equality,
            'equals': equality
          },
          comparison: {
            'is greater than': function(from, to) {
              return ['GreaterThan', from, to];
            },
            'is greater than or equal to': function(from, to) {
              return ['GreaterThanOrEqual', from, to];
            },
            'is less than': function(from, to) {
              return ['LessThan', from, to];
            },
            'is less than or equal to': function(from, to) {
              return ['LessThanOrEqual', from, to];
            },
            'is equal to': equality,
            'equals': equality
          }
        },
        validate: {
          integer: function(value, required, callback) {
            var processedValue;
            processedValue = parseInt(value, 10);
            if (_.isNaN(processedValue)) {
              return callback('is not a number: ' + value);
            } else {
              return callback(null, processedValue);
            }
          },
          text: function(length) {
            return function(value, required, callback) {
              if (!_.isString(value)) {
                return callback('is not a string: ' + value);
              } else if ((length != null) && value.length > length) {
                return callback('longer than ' + length + ' characters (' + value.length + ')');
              } else {
                return callback(null, value);
              }
            };
          },
          date: function(value, required, callback) {
            var processedValue;
            processedValue = Number(value);
            if (_.isNaN(processedValue)) {
              processedValue = value;
            }
            processedValue = new Date(processedValue);
            if (_.isNaN(processedValue.getTime())) {
              return callback('is not a valid date: ' + value);
            } else {
              return callback(null, processedValue);
            }
          }
        }
      };
    })();
    return {
      "Boolean": {
        types: {
          postgres: 'INTEGER DEFAULT 0',
          mysql: 'INTEGER DEFAULT 0',
          websql: 'INTEGER DEFAULT 0',
          odata: {
            name: 'Edm.Boolean'
          }
        },
        fetchProcessing: function(data, callback) {
          return callback(null, data === 1);
        },
        validate: function(originalValue, required, callback) {
          var value;
          value = Number(originalValue);
          if (_.isNaN(value) || (value !== 0 && value !== 1)) {
            return callback("is not a boolean: " + (JSON.stringify(originalValue)) + " (" + (typeof originalValue) + ")");
          } else {
            return callback(null, value);
          }
        }
      },
      "Color": {
        types: {
          postgres: 'INTEGER',
          mysql: 'INTEGER',
          websql: 'INTEGER',
          odata: {
            name: 'Self.Color',
            complexType: '<ComplexType Name="Color">\n	 <Property Name="r" Nullable="false" Type="Edm.Int8"/><Property Name="g" Nullable="false" Type="Edm.Int8"/><Property Name="b" Nullable="false" Type="Edm.Int8"/><Property Name="a" Nullable="false" Type="Edm.Int8"/></ComplexType>'
          }
        },
        nativeProperties: {
          has: {
            'Red Component': function(from) {
              return ['BitwiseAnd', ['BitwiseShiftRight', from, 16], 255];
            },
            'Green Component': function(from) {
              return ['BitwiseAnd', ['BitwiseShiftRight', from, 8], 255];
            },
            'Blue Component': function(from) {
              return ['BitwiseShiftRight', from, 255];
            },
            'Alpha Component': function(from) {
              return ['BitwiseAnd', ['BitwiseShiftRight', from, 24], 255];
            }
          }
        },
        fetchProcessing: function(data, callback) {
          return callback(null, {
            r: (data >> 16) & 0xFF,
            g: (data >> 8) & 0xFF,
            b: data & 0xFF,
            a: (data >> 24) & 0xFF
          });
        },
        validate: function(value, required, callback) {
          var component, componentValue, processedValue;
          if (!_.isObject(value)) {
            processedValue = parseInt(value, 10);
            if (_.isNaN(processedValue)) {
              callback('is neither an integer or color object: ' + value);
              return;
            }
          } else {
            processedValue = 0;
            for (component in value) {
              if (!__hasProp.call(value, component)) continue;
              componentValue = value[component];
              if (_.isNaN(componentValue) || componentValue > 255) {
                callback('has invalid component value of ' + componentValue + ' for component ' + component);
                return;
              }
              switch (component.toLowerCase()) {
                case 'r':
                case 'red':
                  processedValue |= componentValue << 16;
                  break;
                case 'g':
                case 'green':
                  processedValue |= componentValue << 8;
                  break;
                case 'b':
                case 'blue':
                  processedValue |= componentValue;
                  break;
                case 'a':
                case 'alpha':
                  processedValue |= componentValue << 24;
                  break;
                default:
                  callback('has an unknown component: ' + component);
                  return;
              }
            }
          }
          return callback(null, processedValue);
        }
      },
      "ConceptType": {
        types: {
          postgres: 'INTEGER',
          mysql: 'INTEGER',
          websql: 'INTEGER',
          odata: {
            name: 'Edm.Int64'
          }
        },
        nativeFactTypes: {
          Integer: TypeUtils.nativeFactTypeTemplates.comparison,
          Real: TypeUtils.nativeFactTypeTemplates.comparison
        },
        validate: TypeUtils.validate.integer
      },
      "Date Time": {
        types: {
          postgres: 'TIMESTAMP',
          mysql: 'TIMESTAMP',
          websql: 'INTEGER',
          odata: {
            name: 'Edm.DateTime'
          }
        },
        fetchProcessing: function(data, callback) {
          return callback(null, new Date(data));
        },
        validate: TypeUtils.validate.date
      },
      "Date": {
        types: {
          postgres: 'DATE',
          mysql: 'DATE',
          websql: 'INTEGER',
          odata: {
            name: 'Edm.DateTime'
          }
        },
        fetchProcessing: function(data, callback) {
          return callback(null, new Date(data));
        },
        validate: TypeUtils.validate.date
      },
      "File": {
        types: {
          postgres: 'BYTEA',
          mysql: 'BLOB',
          websql: 'BLOB',
          odata: {
            name: 'Edm.String'
          }
        }
      },
      "ForeignKey": {
        types: {
          postgres: 'INTEGER',
          mysql: 'INTEGER',
          websql: 'INTEGER',
          odata: {
            name: 'Edm.Int64'
          }
        },
        nativeFactTypes: {
          Integer: TypeUtils.nativeFactTypeTemplates.comparison,
          Real: TypeUtils.nativeFactTypeTemplates.comparison
        },
        validate: TypeUtils.validate.integer
      },
      "Hashed": (function() {
        var bcrypt;
        try {
          bcrypt = require('bcrypt');
        } catch (_error) {
          bcrypt = require('bcryptjs');
        }
        bcrypt = Promise.promisifyAll(bcrypt);
        return {
          types: {
            postgres: 'CHAR(60)',
            mysql: 'CHAR(60)',
            websql: 'CHAR(60)',
            odata: {
              name: 'Edm.String'
            }
          },
          validate: function(value, required, callback) {
            if (!_.isString(value)) {
              return callback('is not a string');
            } else {
              return bcrypt.genSaltAsync().then(function(salt) {
                return bcrypt.hashAsync(value, salt);
              }).nodeify(callback);
            }
          },
          compare: _.bind(bcrypt.compareAsync, bcrypt)
        };
      })(),
      "Integer": {
        types: {
          postgres: 'INTEGER',
          mysql: 'INTEGER',
          websql: 'INTEGER',
          odata: {
            name: 'Edm.Int64'
          }
        },
        nativeFactTypes: {
          Integer: TypeUtils.nativeFactTypeTemplates.comparison,
          Real: TypeUtils.nativeFactTypeTemplates.comparison
        },
        validate: TypeUtils.validate.integer
      },
      "Interval": {
        types: {
          postgres: 'INTERVAL',
          mysql: 'INTEGER',
          websql: 'INTEGER',
          odata: {
            name: 'Edm.Int64'
          }
        },
        validate: TypeUtils.validate.integer
      },
      "JSON": {
        types: {
          postgres: 'TEXT',
          mysql: 'TEXT',
          websql: 'TEXT',
          odata: {
            name: 'Edm.String'
          }
        },
        fetchProcessing: function(data, callback) {
          var e;
          try {
            return callback(null, JSON.parse(data));
          } catch (_error) {
            e = _error;
            return callback(e);
          }
        },
        validate: function(value, required, callback) {
          var e;
          try {
            return callback(null, JSON.stringify(value));
          } catch (_error) {
            e = _error;
            console.error(e);
            return callback('cannot be turned into JSON: ' + value);
          }
        }
      },
      "Real": {
        types: {
          postgres: 'REAL',
          mysql: 'REAL',
          websql: 'REAL',
          odata: {
            name: 'Edm.Double'
          }
        },
        nativeFactTypes: {
          Integer: TypeUtils.nativeFactTypeTemplates.comparison,
          Real: TypeUtils.nativeFactTypeTemplates.comparison
        },
        validate: function(value, required, callback) {
          var processedValue;
          processedValue = parseFloat(value);
          if (_.isNaN(processedValue)) {
            return callback('is not a number: ' + value);
          } else {
            return callback(null, processedValue);
          }
        }
      },
      "Serial": {
        types: {
          postgres: 'SERIAL',
          mysql: function(necessity, index) {
            return 'INTEGER' + necessity + index + ' AUTO_INCREMENT';
          },
          websql: function(necessity, index) {
            return 'INTEGER' + necessity + index + ' AUTOINCREMENT';
          },
          odata: {
            name: 'Edm.Int64'
          }
        },
        validate: TypeUtils.validate.integer
      },
      "Short Text": {
        types: {
          postgres: 'VARCHAR(255)',
          mysql: 'VARCHAR(255)',
          websql: 'VARCHAR(255)',
          odata: {
            name: 'Edm.String'
          }
        },
        validate: TypeUtils.validate.text(255)
      },
      "Text": {
        types: {
          postgres: 'TEXT',
          mysql: 'TEXT',
          websql: 'TEXT',
          odata: {
            name: 'Edm.String'
          }
        },
        nativeProperties: {
          has: {
            Length: function(from) {
              return ['CharacterLength', from];
            }
          }
        },
        nativeFactTypes: {
          Text: TypeUtils.nativeFactTypeTemplates.equality
        },
        validate: TypeUtils.validate.text()
      },
      "Time": {
        types: {
          postgres: 'TIME',
          mysql: 'TIME',
          websql: 'TEXT',
          odata: {
            name: 'Edm.DateTime'
          }
        },
        fetchProcessing: function(data, callback) {
          return callback(null, new Date('Thu, 01 Jan 1970 ' + data));
        },
        validate: function(value, required, callback) {
          return TypeUtils.validate.date(value, required, function(err, value) {
            if (err) {
              callback(err);
              return;
            }
            return callback(null, value.toLocaleTimeString());
          });
        }
      }
    };
  });

}).call(this);
