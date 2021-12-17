<script type="text/javascript">
var i = 0
imgs = ["https://raw.githubusercontent.com/monsterkodi/konrad/master/img/konrad_sleep.png",
        "https://raw.githubusercontent.com/monsterkodi/konrad/master/img/konrad_idle.png",
        "https://raw.githubusercontent.com/monsterkodi/konrad/master/img/konrad_ok.png",
        "https://raw.githubusercontent.com/monsterkodi/konrad/master/img/konrad_error.png"]
swap = function() { document.getElementById("img").src = imgs[++i%4] }
window.setInterval(swap, 1000);
</script>
<center>
    <img id='img' src="https://raw.githubusercontent.com/monsterkodi/konrad/master/img/konrad_sleep.png">
</center>