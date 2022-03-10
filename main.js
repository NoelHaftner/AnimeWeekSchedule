class anime {
	constructor(photoURL, title, episode, time) {
		this.photoURL = photoURL;
		this.title = title;
		this.episode = episode;
		this.time = time;
	}

	getTimeFormatted23()
	{
		let timeObject = new Date("2001-11-19T" + this.time + ":00.000+09:00");
		let zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return timeObject.toLocaleTimeString('en-US', {timeZone: zone, hour:'numeric', minute:'numeric', hourCycle:'h23'});
	}
	getTimeFormatted12()
	{
		let timeObject = new Date("2001-11-19T" + this.time + ":00.000+09:00");
		let zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return timeObject.toLocaleTimeString('en-US', {timeZone: zone, hour:'numeric', minute:'numeric', hourCycle:'h12'});	
	}
}

function getData(day)
{
	fetch("http://animeweek.live/cacheTemp.json").then(responce => responce.json()).then(json => console.log(json));
	clearData();
	fetch('https://api.jikan.moe/v4/schedules/' + day)
	.then(responce => responce.json())
	.then(data => PopulateEntries(data));
}

function PopulateEntries(data)
{
	const Entries = [];
	for (var i = data.data.length - 1; i >= 0; i--) {
		var entry = new anime(data.data[i].images.webp.image_url, data.data[i].title, data.data[i].episodes, data.data[i].broadcast.time);
		Entries[i] = entry;
	}
	Entries.sort(function(a,b){
		return TimeStringToNumber(a.time) - TimeStringToNumber(b.time);
	});

	for (let i = 0; i < Entries.length; i++) 
	{
		CreateEntry(Entries[i]);
	}

	for(var i = 0; i < 24; i++)
	{
		let num = i;
		if (num < 10) {num = '0' + i.toString();}
		let hour = document.getElementById(num);
		if (hour.children.length < 2)
		{
			hour.style.display = 'none';
		}
	}
}

function clearData()
{
	const elements = document.getElementsByClassName("entry");

	while(elements.length > 0)
	{
		elements[0].parentNode.removeChild(elements[0]);
	}

	for(var i = 0; i < 23; i++)
	{
		let num = i;
		if (num < 10) {num = '0' + i.toString();}
		let hour = document.getElementById(num);
		hour.style.display = 'block';
	}
}


function CreateEntry(Entry)
{
	const entry = document.createElement("div");
	entry.className = "entry";

	const photo = document.createElement("div");
	photo.className = "photo";
	const imgNode = document.createElement("img");
	imgNode.src = Entry.photoURL;
	photo.appendChild(imgNode);
	entry.appendChild(photo);

	const details = document.createElement("div");
	details.className = "details";
	
	const titleNode = CreateParNode('p', Entry.title);
	const episodeNode = CreateParNode('p', Entry.episode);
	
	const timeNode = document.createElement('p');
	const timeText = document.createTextNode(Entry.getTimeFormatted12());
	timeNode.appendChild(timeText);

	details.appendChild(titleNode);
	details.appendChild(episodeNode);
	details.appendChild(timeNode);

	entry.appendChild(details);

	let entryPoint = document.getElementById(SelectTimeDiv(Entry.getTimeFormatted23()));
	entryPoint.appendChild(entry);
}

function GetAirData(id)
{
	switch(id)
	{
		case "M":
		getData("Monday");
		break;

		case "T":
		getData("Tuesday");
		break;

		case "W":
		getData("Wednesday");
		break;

		case "TR":
		getData("Thursday");
		break;

		case "F":
		getData("Friday");
		break;

		case "S":
		getData("Saturday");
		break;

		case "SU":
		getData("Sunday");
		break;
	}
}

function CreateParNode(nodeType, content)
{
	let node = document.createElement(nodeType);
	let contentNode = document.createTextNode(content);
	node.appendChild(contentNode);
	return node;
}

function SelectTimeDiv(time)
{
	if(time === null)
	{
		return "Unknown";
	}
	let copy = time.substring(0, 2);
	return copy;
}

function TimeStringToNumber(time)
{
	if (time === null)
	{
		return;
	}
	return parseInt(time.split(':').join(''));
}