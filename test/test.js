var assert = require('assert'),
    blockStyleCorrect       = require('../src/checks/checkBlockStyle'),
    brackets				= require('../src/checks/checkForBrackets'),
    checkBorderNone         = require('../src/checks/checkBorderNone'),
    colon                   = require('../src/checks/checkForColon'),
    commaStyleCorrect       = require('../src/checks/checkCommaStyle'),
    commentStyleCorrect     = require('../src/checks/checkCommentStyle'),
    cssLiteral              = require('../src/checks/checkForCssLiteral'),
    efficient               = require('../src/checks/checkForEfficiency'),
    extendStyleCorrect      = require('../src/checks/checkForExtendStyle'),
    hasComment              = require('../src/checks/checkForComment'),
    hashEnding              = require('../src/checks/checkForHashEnd'),
    hashStarting            = require('../src/checks/checkForHashStart'),
    leadingZero             = require('../src/checks/checkForLeadingZero'),
    mixedSpacesOrTabs       = require('../src/checks/checkForMixedSpacesTabs'),
    namingConvention		= require('../src/checks/checkNamingConvention'),
    parenStyleCorrect       = require('../src/checks/checkForParenStyle'),
    placeholderStyleCorrect = require('../src/checks/checkForPlaceholderStyle'),
    semicolon               = require('../src/checks/checkForSemicolon'),
    should                  = require('should'),
    startsWithComment       = require('../src/checks/checkForCommentStart'),
    tooMuchNest             = require('../src/checks/checkNesting'),
    universalSelector       = require('../src/checks/checkForUniversal'),
    whitespace				= require('../src/checks/checkForTrailingWhitespace'),
    varStyleCorrect         = require('../src/checks/checkVarStyle'),
    zeroUnits				= require('../src/checks/checkForZeroUnits');


describe('Linter Style Checks: ', function() {

    describe('block style', function() {
        it ('should return false if block style incorrect or true if correct', function() {
            assert.equal( false, blockStyleCorrect('myBlock = ') );
            assert.equal( false, blockStyleCorrect('myBlock =') );
            assert.equal( true, blockStyleCorrect('myBlock = @block') );
            assert.equal( true, blockStyleCorrect('myBlock = @block ') );
            assert.equal( undefined, blockStyleCorrect('margin 0') );
            assert.equal( undefined, blockStyleCorrect('myHash = {') );
            assert.equal( undefined, blockStyleCorrect() );
        });
    });

    describe('border none', function() {
        it ('should return true if border none is present, else return false', function() {
            assert.equal( false, checkBorderNone('border 0') );
            assert.equal( true, checkBorderNone('border none') );
            assert.equal( undefined, checkBorderNone('margin 0') );
            assert.equal( undefined, checkBorderNone() );
        });
    });

    // 2nd param being passed in here determines if we're in a hash or not (true means hash)
    describe('brackets', function() {
        it ('should return true if legit bracket found on line (not interpolation, not hash)', function() {
            assert.equal( false, brackets('.className ', false) );
            assert.equal( false, brackets('.className ', true) );
            assert.equal( false, brackets('}', true) );
            assert.equal( false, brackets('{interpolation}', true) );
            assert.equal( false, brackets('{interpolation}', false) );
            assert.equal( true, brackets('.className {', false) );
            assert.equal( true, brackets('}', false) );
            assert.equal( undefined, brackets('}') );
            assert.equal( undefined, brackets() );
        });
    });

    describe('has comment', function() {
        it ('should return true if // is present anywhere on the line', function() {
            assert.equal( false, hasComment('.noCommentOnThisLine ') );
            assert.equal( true, hasComment('//test') );
            assert.equal( true, hasComment('margin 0 auto //test') );
            assert.equal( true, hasComment('margin 0 auto // test') );
            assert.equal( true, hasComment('// test') );
            assert.equal( undefined, hasComment() );
        });
    });

    describe('starts with comment', function() {
        it ('should return true if // is the first character on the line', function() {
            assert.equal( false, startsWithComment('margin 0 auto //test') );
            assert.equal( true, startsWithComment('//test') );
            assert.equal( true, startsWithComment(' // test') );
            assert.equal( undefined, startsWithComment('.noCommentOnThisLine ') );
            assert.equal( undefined, startsWithComment() );
        });
    });

    describe('comment style', function() {
        it ('should return true if line comment has space after it, false if not', function() {
            assert.equal( false, commentStyleCorrect('//test') );
            assert.equal( false, commentStyleCorrect('margin 0 auto //test') );
            assert.equal( true, commentStyleCorrect('margin 0 auto // test') );
            assert.equal( true, commentStyleCorrect('// test') );
            assert.equal( undefined, commentStyleCorrect('.noCommentOnThisLine') );
            assert.equal( undefined, commentStyleCorrect() );
        });
    });

    describe('comma style', function() {
        it ('should return true if space after commas, false if not', function() {
            assert.equal( false, commaStyleCorrect('0,0, 0, .18') );
            assert.equal( true, commaStyleCorrect('0, 0, 0, .18') );
            assert.equal( undefined, commaStyleCorrect('.no-need-for-comma') );
            assert.equal( undefined, commaStyleCorrect() );
        });
    });

    describe('colon style', function() {
        it ('should return true if unecessary colon is found', function() {
            assert.equal( false, colon('margin 0 auto', false) );
            assert.equal( true, colon('margin: 0 auto', false) );
            assert.equal( undefined, colon('margin: 0 auto') );
            assert.equal( undefined, colon() );
            assert.equal( undefined, colon(undefined, false) );
            assert.equal( undefined, colon(undefined, true) );
        });
    });

    describe('css literal', function() {
        it ('should return true if @css is used, false if not', function() {
            assert.equal( false, cssLiteral('not a css literal') );
            assert.equal( false, cssLiteral('@extends $placeholderVar') );
            assert.equal( true, cssLiteral('@css {') );
            assert.equal( undefined, cssLiteral() );
        });
    });

    describe('efficient', function() {
        it ('should return true if value is efficient, false if not', function() {
            assert.equal( false, efficient('margin 0 0 0 0') );
            assert.equal( false, efficient('margin 0 0 0') );
            assert.equal( false, efficient('margin 0 0') );
            assert.equal( false, efficient('margin 0 5px 0 5px') );
            assert.equal( false, efficient('margin 5px 0 5px') );
            assert.equal( false, efficient('margin 5px 0 5px 0') );
            assert.equal( false, efficient('margin 0 5px 0') );
            assert.equal( true, efficient('margin 0 5px') );
            assert.equal( true, efficient('margin 5px 0') );
            assert.equal( true, efficient('margin 5px') );
            assert.equal( true, efficient('margin 5px 0 0') );
            assert.equal( true, efficient('margin 0') );
            assert.equal( undefined, efficient('.not-margin-or-padding') );
            assert.equal( undefined, efficient() );
        });
    });

    describe('extends style', function() {
        it ('should return true if value matches preferred style', function() {
            assert.equal( false, extendStyleCorrect('@extend $placeHolderVar', '@extends') );
            assert.equal( false, extendStyleCorrect('@extends $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extend $placeHolderVar', '@extend') );
            assert.equal( true, extendStyleCorrect('@extends $placeHolderVar', '@extends') );
            assert.equal( undefined, extendStyleCorrect('@extends $placeHolderVar') );
            assert.equal( undefined, extendStyleCorrect() );
            assert.equal( undefined, extendStyleCorrect(undefined, '@extends') );
        });
    });

    describe('hash start', function() {
        it ('should return true if = and { are found on the same line', function() {
            assert.equal( false, hashStarting('$myVar =') );
            assert.equal( false, hashStarting('myVar = @block') );
            assert.equal( false, hashStarting('.mistakenUseOfBracket {') );
            assert.equal( false, hashStarting('margin 0') );
            assert.equal( true, hashStarting('myHash = {') );
            assert.equal( undefined, hashStarting() );
        });
    });

    describe('hash end', function() {
        it ('should return true if 2nd param is set to true and } is found', function() {
            assert.equal( false, hashEnding('margin 0', true) );
            assert.equal( false, hashEnding('myHash = {', true) );
            assert.equal( false, hashEnding('margin 0', false) );
            assert.equal( false, hashEnding('myHash = {', false) );
            assert.equal( false, hashEnding('}', false) );
            assert.equal( true, hashEnding('}', true) );
            assert.equal( undefined, hashEnding('}') );
            assert.equal( undefined, hashEnding() );
        });
    });

    describe('leading zero', function() {
        it ('should return true line if line has a zero before a decimal point and not part of range', function() {
            assert.equal( true, leadingZero('color (0, 0, 0, 0.18)') );
            assert.equal( true, leadingZero('color (0,0,0,0.18)') );
            assert.equal( false, leadingZero('color (0, 0, 0, .18)') );
            assert.equal( false, leadingZero('color (0,0,0,.18)') );
            assert.equal( false, leadingZero('for $ in (0..9)') );
            assert.equal( undefined, leadingZero() );
        });
    });

    describe('mixed spaces and tabs', function() {
        it ('should return true if spaces and tabs are mixed, false if not', function() {
            assert.equal( false, mixedSpacesOrTabs('    margin 0', 4) );
            assert.equal( false, mixedSpacesOrTabs('	margin 0', false) );
            assert.equal( true, mixedSpacesOrTabs('		margin 0', 4) );
            assert.equal( true, mixedSpacesOrTabs('	 	 margin 0', false) );
            assert.equal( true, mixedSpacesOrTabs('		padding 0em', 4) );
            assert.equal( undefined, mixedSpacesOrTabs() );
        });
    });

    describe('naming convention', function() {
        it ('should return true if correct naming convention, false if not, undefined if line not checkable', function() {
            assert.equal( true, namingConvention('$var-name-like-this =', 'lowercase-dash') );
            assert.equal( true, namingConvention('.class-name-like-this', 'lowercase-dash') );
            assert.equal( true, namingConvention('#id-name-like-this', 'lowercase-dash') );

            assert.equal( true, namingConvention('$var_name_like_this =', 'lowercase-underscore') );
            assert.equal( true, namingConvention('.class_name_like_this', 'lowercase-underscore') );
            assert.equal( true, namingConvention('#id_name_like_this', 'lowercase-underscore') );

            assert.equal( true, namingConvention('$varNameLikeThis =', 'camelCase') );
            assert.equal( true, namingConvention('.classNameLikeThis', 'camelCase') );
            assert.equal( true, namingConvention('#idNameLikeThis', 'camelCase') );

            assert.equal( false, namingConvention('$var_name_like_this =', 'lowercase-dash') );
            assert.equal( false, namingConvention('.class_name_like_this', 'lowercase-dash') );
            assert.equal( false, namingConvention('#id_name_like_this', 'lowercase-dash') );

            assert.equal( false, namingConvention('$var-name-like-this =', 'lowercase-underscore') );
            assert.equal( false, namingConvention('.class-name-like-this', 'lowercase-underscore') );
            assert.equal( false, namingConvention('#id-name-like-this', 'lowercase-underscore') );

            assert.equal( false, namingConvention('$var-name-like-this =', 'camelCase') );
            assert.equal( false, namingConvention('.class-name-like-this', 'camelCase') );
            assert.equal( false, namingConvention('#id-name-like-this', 'camelCase') );

            assert.equal( undefined, namingConvention('$var_name_like_this =', false) );
            assert.equal( undefined, namingConvention('.class_name_like_this', false) );
            assert.equal( undefined, namingConvention('#id_name_like_this', false) );
            assert.equal( undefined, namingConvention('$var-name-like-this =', false) );
            assert.equal( undefined, namingConvention('.class-name-like-this', false) );
            assert.equal( undefined, namingConvention('#id-name-like-this', false) );
            assert.equal( undefined, namingConvention('$var-name-like-this =', false) );
            assert.equal( undefined, namingConvention('.class-name-like-this', false) );
            assert.equal( undefined, namingConvention('#id-name-like-this', false) );
            assert.equal( undefined, namingConvention('margin 0', false) );
            assert.equal( undefined, namingConvention('margin 0', 'lowercase-dash') );
            assert.equal( undefined, namingConvention('padding inherit', 'camelCase') );
            assert.equal( undefined, namingConvention('body ', 'lowercase-underscore') );
            assert.equal( undefined, namingConvention() );
            assert.equal( undefined, namingConvention('.className') );
        });
    });

	describe('nesting', function() {
	    it ('should return true if more indents than 2nd param', function() {
	        assert.equal( false, tooMuchNest('margin 0', 4, 4) );
	        assert.equal( false, tooMuchNest('			margin 0', 4, 4) );
	        assert.equal( true, tooMuchNest('          margin 0', 1, 4) );
	        assert.equal( true, tooMuchNest('       margin 0', 2, 2) );
	        assert.equal( true, tooMuchNest('                   margin 0 )', 4, 4) );
	        assert.equal( true, tooMuchNest('					margin 0 )', 4, false) );
	        assert.equal( true, tooMuchNest('		margin 0 )', 1, false) );
            assert.equal( undefined, tooMuchNest('       margin 0 )', undefined, false) );
            assert.equal( undefined, tooMuchNest('       margin 0 )', undefined, 4) );
            assert.equal( undefined, tooMuchNest('       margin 0 )', undefined, undefined) );
            assert.equal( undefined, tooMuchNest('       margin 0 )', 4, undefined) );
            assert.equal( undefined, tooMuchNest(undefined, undefined, undefined) );
	    });
	});

    describe('paren style', function() {
        it ('should return true if extra spaces are found, false if not', function() {
            assert.equal( false, parenStyleCorrect('myMixin(param1, param2)') );
            assert.equal( true, parenStyleCorrect('myMixin( param1, param2 )') );
            assert.equal( undefined, parenStyleCorrect('.notAMixin ') );
            assert.equal( undefined, parenStyleCorrect() );
        });
    });

    describe('placeholder style', function() {
        it ('should return true if placeholder var is used, false if not', function() {
            assert.equal( false, placeholderStyleCorrect('@extends .notPlaceholderVar') );
            assert.equal( true, placeholderStyleCorrect('@extends $placeholderVar') );
            assert.equal( undefined, placeholderStyleCorrect('margin 0') );
            assert.equal( undefined, placeholderStyleCorrect() );
        });
    });

    describe('semicolon', function() {
        it ('should return true if semicolon is found', function() {
            assert.equal( false, semicolon('margin 0 auto') );
            assert.equal( true, semicolon('margin 0 auto;') );
            assert.equal( undefined, semicolon() );
        });
    });

    describe('trailing whitespace', function() {
        it ('should return true if whitespace found', function() {
            assert.equal( true, whitespace('margin 0 auto	') );
            assert.equal( true, whitespace('margin 0 auto ') );
            assert.equal( false, whitespace('margin 0 auto') );
            assert.equal( undefined, whitespace() );
        });
    });

    describe('universal selector', function() {
        it ('should return true if * is found', function() {
            assert.equal( false, universalSelector('img') );
            assert.equal( true, universalSelector('*') );
            assert.equal( true, universalSelector('*:before') );
            assert.equal( undefined, universalSelector() );
        });
    });

    /**
     * would like to have this be smarter
     * ideally it would know whether or not a $ should be used based on context
     * right now it just checks if $ is used when defining a var and thats it
     */
    describe('var style check for find vars that dont have $ in front of them', function() {
        it ('should return true if $ is found, false if not', function() {
            assert.equal( false, varStyleCorrect('myVar = 0') );
            assert.equal( true, varStyleCorrect('$myVar = 0') );
            assert.equal( true, varStyleCorrect('$first-value = floor( (100% / $columns) * $index )') );
            assert.equal( undefined, varStyleCorrect('define-my-mixin( $myParam )') );
            assert.equal( undefined, varStyleCorrect('if($myParam == true)') );
            assert.equal( undefined, varStyleCorrect('.notAVar') );
            assert.equal( undefined, varStyleCorrect('if(myParam == true)') );
            assert.equal( undefined, varStyleCorrect('define-my-mixin( myParam )') );
            assert.equal( undefined, varStyleCorrect('  use-my-mixin( myParam )') );
            assert.equal( undefined, varStyleCorrect('  if( $myParam )') );
            assert.equal( undefined, varStyleCorrect() );
        });
    });

    describe('zero units', function() {
        it ('should return true if 0 + any unit type is found (0 is preferred)', function() {
            assert.equal( true, zeroUnits('margin 0px') );
            assert.equal( true, zeroUnits('margin 0em') );
            assert.equal( true, zeroUnits('margin 0%') );
            assert.equal( true, zeroUnits('margin 0rem') );
            assert.equal( true, zeroUnits('margin 0pt') );
            assert.equal( true, zeroUnits('margin 0pc') );
            assert.equal( true, zeroUnits('margin 0vh') );
            assert.equal( true, zeroUnits('margin 0vw') );
            assert.equal( true, zeroUnits('margin 0vmin') );
            assert.equal( true, zeroUnits('margin 0vmax') );
            assert.equal( true, zeroUnits('margin 0mm') );
            assert.equal( true, zeroUnits('margin 0cm') );
            assert.equal( true, zeroUnits('margin 0in') );
            assert.equal( true, zeroUnits('margin 0mozmm') );
            assert.equal( true, zeroUnits('margin 0ex') );
            assert.equal( true, zeroUnits('margin 0ch') );
            assert.equal( false, zeroUnits('margin 0') );
            assert.equal( undefined, zeroUnits() );
        });
    });

});