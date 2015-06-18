function scroll() {
	$('body').scrollspy({ target: '#navbar' });
};

function pullright() {
	$(window).resize(function() {
		detect();
	});
};

function smooth() {
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

function detect(){
	if ($(window).width() >= 768) {
		$('#navbar').addClass('pull-right');
	}else{
		$('#navbar').removeClass('pull-right');
	};	
};


var funcs = [scroll, smooth, pullright, detect]


$(document).ready(funcs);