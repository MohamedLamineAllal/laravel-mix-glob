function matchAddedFileToWatchedGlobs(addedFile) {
    return new Promise((resolve, reject) => {
        const glbsResolutionPrms = [];
        for (const glb of this.matchedGlobs) {
            glbsResolutionPrms.push(new Promise((resolve, reject) => {
                try {
                    resolve(globbyResolve(glb));
                } catch (err) {
                    reject(err);
                }
            }));
        }

        Promise.all(glbsResolutionPrms)
            .then(listOfListOfFiles => {
                mglogger.debug('matchAddedFileToWatchedGlobs:'.bgBlue)
                mglogger.debug({
                    addedFile,
                    listOfListOfFiles
                })
                for (const files of listOfListOfFiles) {
                    if (files.includes(addedFile)) {
                        mglogger.debug('matched !!!!'.yellow);
                        mglogger.debug({
                            addedFile,
                            files
                        });
                        resolve();
                    }
                }
                reject();
            })
            .catch(err => {
                reject(err);
            });
    });
}