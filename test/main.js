import tap from 'tap';

import pkg from './../package.json';

import * as travis from './utils/travis';

import testCommitChangesScriptUsingDeployKeys from './commit-changes-with-deploy-key/tests';
import testUpdateBranchScriptUsingDeployKeys from './update-branch-with-deploy-key/tests';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const isTestBranch = () =>
    (travis.getBranchName()).indexOf(pkg['config']['test-branch-prefix']) === 0;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const main = async () => {

    // If this is executed from a pull request send from a forked
    // repository, do not continue any further as the tests won't
    // work because:
    //
    //  1) pull requests sent from forked repositories do not
    //     have access to the secure environment variables from
    //     this repository, and thus, the test branches cannot
    //     be automatically created
    //
    //     https://docs.travis-ci.com/user/pull-requests/#Security-Restrictions-when-testing-Pull-Requests
    //
    //  2) there is no fully secure way to automatically import
    //     code from a pull request into a local branch
    //
    //     (... and yes, I have trust issues!)

    if ( travis.isPullRequest() === true ) {
        process.exit(0);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    if ( isTestBranch() ) {
        tap.pass('Job passed');
    } else {
        tap.test('Tests', (t) => {

            testCommitChangesScriptUsingDeployKeys(t);
            testUpdateBranchScriptUsingDeployKeys(t);

            t.end();

        });
    }


};

main();
