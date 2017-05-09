
/**
 * This directive is used in the reistration form to check that passwords match
 */
app.directive('wjValidationError', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctl) {
      scope.$watch(attrs['wjValidationError'], function (error) {
        elm[0].setCustomValidity(error);
        console.log(error)
        ctl.$setValidity('wjValidationError', error ? false : true);
      });
    }
  };
});
