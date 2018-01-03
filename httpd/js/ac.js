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
  $.getJSON("/devices/last-time/1/devices.json").done(function(devjson){
    for (var x in devjson){
      netkey = devjson[x]['kismet.device.base.key']
      netname = devjson[x]['kismet.device.base.name']
      netbssid = devjson[x]['kismet.device.base.macaddr']
      netchannel = devjson[x]['kismet.device.base.channel']
      netclients = devjson[x]['dot11.device']['dot11.device.associated_client_map']
      $('#aireplay-bssid-select').append('<option value='+netbssid+' data-channel='+netchannel+'>'+netname+" - "+netbssid+" - Channel: "+netchannel)
    }
  })
}


function getInterfaces(){
  $.getJSON("/datasource/list_interfaces.json").done(function(intjson){
    for (var x in intjson){
      intname = intjson[x]['kismet.datasource.probed.interface']
      intuuid = intjson[x]['kismet.datasource.probed.in_use_uuid']
      inttype = intjson[x]['kismet.datasource.type_driver']['kismet.datasource.driver.type']
      if (inttype == "linuxwifi" && intuuid == "00000000-0000-0000-0000-000000000000"){
        $('#aireplay-interface-select').append('<option value='+intname+">"+intname+" --- system interface")
      }
    }
  })
  $.getJSON("/datasource/all_sources.json").done(function(dsjson){
    for (var x in dsjson){
      dsname = dsjson[x]['kismet.datasource.name']
      dsuuid = dsjson[x]['kismet.datasource.uuid']
      dschannels = dsjson[x]['kismet.datasource.hop_channels']
      dslock = dsjson[x]['kismet.datasource.channel']
      dstype = dsjson[x]['kismet.datasource.type_driver']['kismet.datasource.driver.type']
      dsremote = dsjson[x]['kismet.datasource.remote']
      dshopstatus = dsjson[x]['kismet.datasource.hopping']
      if (dsremote == 0 && dstype == "linuxwifi" && dshopstatus == 1){
        $('#aireplay-interface-select').append('<option value='+dsname+" data-hop=true>"+dsname+" --- Kismet enabled interface --- hopping")
      } else if (dsremote == 0 && dstype == "linuxwifi" && dshopstatus == 0){
        $('#aireplay-interface-select').append('<option value='+dsname+" data-hop=false>"+dsname+" --- Kismet enabled interface --- Channel: "+dslock)
      }
    }
  })
}

  $("#aireplay-attacks-select").change(function() {
    hideThing();
    $('#aireplay-interface-select').find('option').remove().end();
    var selectedattack = $(this).val(); // or this.value
    if (selectedattack == 0){ //DeAuth
      $('#aireplay-deauths').show()
      $('#aireplay').accordion("refresh")
      $('#aireplay-deauths-select').change(function() {
        $('#aireplay-bssid-select').find('option').remove().end();
        var delay = $(this).val();
        getNetworks();
        $('#aireplay-bssid').show();
        $('#aireplay').accordion("refresh")
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
      })
      $('#aireplay-client-select').change(function(){
        $('#aireplay-interface-select').find('option').remove().end();
        var client = $(this).filter(":selected").text()
        getInterfaces();
         $('#aireplay-interface').show()
         $('#aireplay-attack').show().on('click', function(){
           var selectedinterface = $('#aireplay-interface-select').children("option").filter(":selected").text()
           var selecteddelay =$('#aireplay-deauths-select').children("option").filter(":selected").text()
           var selectedbssid = $('aireplay-bssid-select').children("option").filter(":selected").text()
           var selectedclient = $('aireplay-client-select').children("option").filter(":selected").text()
           console.log(selectedattack, selecteddelay, selectedbssid, selectedclient, selectedinterface)
         })
         $('#aireplay').accordion("refresh")
      })
      $('#aireplay-interface-select').change(function() {
        var selectedinterface = $('#aireplay-interface-select').children("option").filter(":selected").text()
        var selecteddelay =$('#aireplay-deauths-select').children("option").filter(":selected").text()
        var selectedbssid = $('aireplay-bssid-select').children("option").filter(":selected").text()
        var selectedclient = $('aireplay-client-select').children("option").filter(":selected").text()
        //var selectedchannel = $('aireplay-bssid-select').children("option").filter(":selected").getAttribute("data-channel")
         $('#aireplay-attack').show().on('click', function(){
           console.log(selectedattack, selecteddelay, selectedbssid, selectedclient, selectedinterface)
         })
         $('#aireplay').accordion("refresh");
      })
    } else if (selectedattack == 1){ //FakeAuth
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
    } else if (selectedattack == 9) { //InjectionTest
      hideThing();
      getInterfaces();
      $('#aireplay-interface').show();
      $('#aireplay').accordion("refresh")
      $('#aireplay-interface-select').change(function() {
        var kismetinterface = $('#aireplay-interface-select').children("option").filter(":selected").text()
         $('#aireplay-attack').show()
         $('.aireplay-attack-button').click(function(){
           console.log("Issuing Get to http://localhost:2566/injectiontest/"+kismetinterface)
           $.getJSON("http://localhost:2566/injectiontest/"+kismetinterface).done(function(response){
             alert(response.text())
           })
         })
         $('#aireplay').accordion("refresh");
      })
    }
    else {
      hideThing();
    }
});
