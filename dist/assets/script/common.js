jQuery.browser = {};
(function () {
  jQuery.browser.msie = false;
  jQuery.browser.version = 0;
  if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
    jQuery.browser.msie = true;
    jQuery.browser.version = RegExp.$1;
  }
})();


$(function() {
  let Accordion = function(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;

    let links = this.el.find('.link');
    let links2 = this.el.find('.links2');
    let menus = links.next().find('.item');

    links.on('click', {
      el: this.el,
      multiple: this.multiple,
      sub: false
    }, this.dropdown)
    links2.on('click', {
      el: this.el,
      multiple: this.multiple,
      sub: true
    }, this.dropdown)
    menus.on('click', {
      el: this.el,
      links: links
    }, this.selectItem);
  }

  Accordion.prototype.selectItem = function (e) {
    let subAcc = $(this).parents()

    if (subAcc.hasClass('toggle')) {
      console.log(1111)
      $('#selectTime').text($(this).text());

      let selectDate = $("#selectDay").text();

    } else {
      console.log(222)
      $(this).parents('li').find('.text').addClass('select-txt').html(()=>{
        if ($(this).parents('li')[0].dataset.menu) {          
          return `${$(this).parents('li')[0].dataset.menu} <span class="text--point">${$(this).text()}</span>`
        }
        return `<span class="text--point">${$(this).text()}</span>`
      })
      $(this).parent().slideUp().parent().removeClass('open');
      $(this).parents('li').next().addClass('open').find('.submenu').slideDown();
    }
  }
  Accordion.prototype.dropdown = function(e) {
    let $el = e.data.el,
        $this = $(this),
        $next = $this.next();
    if (e.data.sub) {
      $next.slideDown();
    } else {
      $next.slideToggle();
      $this.parent().toggleClass('open');
    }

    if (!e.data.sub && !e.data.multiple) {
      $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    };
    if (e.data.sub && !e.data.multiple) {
      $el.find('.toggle').not($next).slideUp();
    };
  }

  let accordion = new Accordion($('#accordion'), false);
  let subAccordion = new Accordion($('#sub-accordion'), false);
});

/* Calendar */
$('#datepicker').datepicker({
  dateFormat: "yy.mm.dd",
  showOn: true,
  showOtherMonths: true,
  selectOtherMonths: true,
  showMonthAfterYear: true,
  gotoCurrent: true,
  yearSuffix: '년',
  dayNames: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
  dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'],
  monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  minDate: 0,
  maxDate: "+30D",
  onSelect:function(d){
    let arr = d.split(".");

    $("#year").text(arr[0]);
    $("#month").text(arr[1]);
    $("#day").text(arr[2]);

    //요일 가져오기
    //데이터를 먼저 가져오고 (숫자로 넘어옴)
    let date = new Date($("#datepicker").datepicker({dateFormat:"yy.mm.dd"}).val());
    let week = new Array("일","월","화","수","목","금","토");

    $('#date').html(`<span class="text--point">매주 ${week[date.getDay()]}요일, 주1회<br> 10:00~12:00/4주 과정</span>`);
    $('#selectDay').html(`매주 ${week[date.getDay()]}요일, 주1회 10:00~12:00/4주 과정`);

    // $('.calendar-box').slideToggle(500);

    // $('.accordion-list li').removeClass('open');
  }
});
