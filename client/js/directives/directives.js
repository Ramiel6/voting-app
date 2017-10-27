app.directive("loadingDir", function() {
    return {
        restrict : "EA",
        template : '<div class="loading"><div class="loading-text"><i class="fa fa-cog fa-spin cog-font" aria-hidden="true"></i><p>Working..</p></div></div>'
    };
});