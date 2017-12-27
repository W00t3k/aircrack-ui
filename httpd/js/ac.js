$(function(){$( "#aireplay" ).accordion({collapsible: true, active: false});});
$(function(){$( "#aircrack" ).accordion({collapsible: true, active: false});});

function hideThing() {
  $('#aireplay-deauths').hide();
  $('#aireplay-fakeauth-delay').hide();
  $('#aireplay-bssid').hide();
  $('#aireplay-client').hide();
  $('#aireplay-interface').hide();
  $('#aireplay-attack').hide();
}

hideThing();

function getNetworks() {
  $.getJSON("/devices/last-time/-30/devices.json").done(function(devjson){
    for (var x in devjson){
      netkey = devjson[x]['kismet.device.base.key']
      netname = devjson[x]['kismet.device.base.name']
      netbssid = devjson[x]['kismet.device.base.macaddr']
      netclients = devjson[x]['dot11.device']['dot11.device.associated_client_map']
      $('#aireplay-bssid-select').append('<option value='+netbssid+'>'+netname+" - "+netbssid)
    }
  })
}


function getInterfaces(){
$.getJSON("/datasource/all_sources.json").done(function(dsjson){
  for (var x in dsjson){
    dsname = dsjson[x]['kismet.datasource.name']
    dsuuid = dsjson[x]['kismet.datasource.uuid']
    dschannels = dsjson[x]['kismet.datasource.channels']
    dstype = dsjson[x]['kismet.datasource.type_driver']['kismet.datasource.driver.type']
    dsremote = dsjson[x]['kismet.datasource.remote']
    if (dsremote == 0 && dstype == "linuxwifi"){
      $('#aireplay-interface-select').append('<option value='+dsuuid+">"+dsname)
    }
  }
})
}

  $("#aireplay-attacks-select").change(function() {
    hideThing();
    var selected = $(this).val(); // or this.value
    if (selected == 0){ //DeAuth
      $('#aireplay-deauths').show()
      $('#aireplay').accordion("refresh")
      $('#aireplay-deauths-select').change(function() {
        $('#aireplay-bssid-select').find('option').remove().end();
        var delay = $(this).val();
        getNetworks();
        $('#aireplay-bssid').show();
        $('#aireplay').accordion("refresh")
        return delay;
      })
      $('#aireplay-bssid-select').change(function() {
        $('#aireplay-client-select').find('option').remove().end();
        var selectedbssid = $(this).val();
        console.log(selectedbssid)
        $.getJSON("/devices/by-mac/"+selectedbssid+"/devices.json").done(function(clijson){
          for (var x in clijson){
            netclients = clijson[x]['dot11.device']['dot11.device.associated_client_map']
            for (var y in netclients){
            $('#aireplay-client-select').append('<option id='+y+'>'+y)
            }
          }
        })
         $('#aireplay-client').show()
         $('#aireplay').accordion("refresh")
        return selectedbssid;
      })
      $('#aireplay-client-select').change(function(){
        var client = $(this).text
        getInterfaces();
         $('#aireplay-interface').show()
         $('#aireplay').accordion("refresh")
        return client;
      })
      $('#aireplay-interface-select').change(function() {
        var kismetinterface = $(this).text
         $('#aireplay-attack').show().on('click', function(){
           console.log(selected, delay, bssid, client, kismetinterface)
         })
         $('#aireplay').accordion("refresh");
      })
    } else if (selected == 1){ //FakeAuth
      hideThing();
      $('#aireplay-fakeauth-delay').show()
      $('#aireplay').accordion("refresh")
      $('#aireplay-fakeauth-select').change(function() {
        var dselected = $(this).val();
         $('#aireplay-bssid').show();
         $('#aireplay').accordion("refresh")
      })
      $('#aireplay-bssid-select').change(function() {
        var dselected = $(this).val();
         $('#aireplay-client').show()
         $('#aireplay').accordion("refresh")
      })
      $('#aireplay-client-select').change(function(){
         $('#aireplay-interface').show()
         $('#aireplay').accordion("refresh")
      })
      $('#aireplay-interface-select').change(function() {
         $('#aireplay-attack').show().on('click', function(){
           console.log("aireplay-ng -1 ")
         })
         $('#aireplay').accordion("refresh");
      })
    } else if (selected == 9) { //InjectionTest
      hideThing();
      $('#aireplay-bssid').show();
      $('#aireplay').accordion("refresh")
      $('#aireplay-bssid-select').change(function() {
        $('#aireplay-client').show()
        $('#aireplay').accordion("refresh")
      })
    }
    else {
      hideThing();
    }
});
