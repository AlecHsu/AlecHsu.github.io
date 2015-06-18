var scroll = function() {
	$('body').scrollspy({ target: '#navbar' });
};

var pullright = function() {
	$(window).resize(function() {
		if ($(window).width() <= 768) {
			$('#navbar').removeClass('pull-right');
		}else{
			$('#navbar').addClass('pull-right');
		};	
	});
};

var smooth = function() {
	$('#navbar a, .slide_to_profile').click(function() {
		$('body').animate({
			scrollTop: $( $(this).attr('href') ).offset().top
		}, 500);
		
		if ($(window).width() <= 768) {
			if($('#navbar').css('display') !='none') {
				$('.navbar-toggle').click();
	        };
		};

		return false;
	});
};


var i = [scroll, smooth, pullright]

$(document).ready(i);