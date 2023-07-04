const contentDivs = document.querySelectorAll('.mdl-typography--body-1');
const watchlist = Array.from(contentDivs).slice(0, 50);

let FinalResults = [];
let scraped = 0;


function loadClient() {
  gapi.client.setApiKey("AIzaSyBIkmeX0zPp0eG9wYl0kabMDAa_HLQL1Es");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
}

const GetVideoData = (video_id) => {
  return gapi.client.youtube.videos.list({
    "part": [
      "snippet,contentDetails,statistics"
    ],
    "id": [
      video_id
    ],
    "maxResults": 1
  })
  .then(function(response) {
    // Handle the results here (response.result has the parsed body).
    // console.log("Response", response);
    const data = response.result.items[0]

    const statistics = data.statistics
    const snippet = data.snippet

    const viewCount = statistics.viewCount;
    const likeCount = statistics.likeCount;
    const commentCount = statistics.commentCount;
    const publishedAt = snippet.publishedAt;
    const title = snippet.title;
    const channelTitle = snippet.channelTitle;

    const videodata = {
      title,
      channelTitle,
      publishedAt,
      viewCount,
      likeCount,
      commentCount,  
    }
  console.log(videodata)
  FinalResults.push(videodata)
  if (FinalResults.length == scraped){
    console.log('Done here too')
    gnerateCSV(FinalResults)
  }

  },
  function(err) { console.error("Execute error", err); 
});
}





// Make sure the client is loaded before calling this method.
function execute(title) {
return gapi.client.youtube.search.list({
      "part": [
      "snippet"
      ],
      "q" : [title],
      "maxResults": 1

    })
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).         
        const data = response.result.items;
        data.forEach(video => {
        const video_id = video.id.videoId;
        GetVideoData(video_id);
        scraped++;
        })
    },
    function(err) { console.error("Execute error", err);
  });
}




gapi.load("client");


function saveFile(content, filename){
  const encoded = encodeURIComponent(content)
  const link = document.createElement('a');
  link.href='data:text/csv;charset=utf-8,' + encoded
  link.download = filename;
  link.click();
}


function gnerateCSV(statsdata){
  const worksheetData = statsdata.map(video=>{
    return [
    video.title,
    video.channelTitle,
    video.publishedAt,
    video.likeCount,
    video.viewCount,
    video.commentCount].join(',')
  });
  const csvContent = 'Title,Channel,DatePublished, Likes, Views, Comments\n' + worksheetData.join('\n');
  saveFile(csvContent, 'video-data')
}



const scrap = function(){
  watchlist.forEach((div) => {
    const links = div.querySelectorAll('a');
    if (links.length >= 2) {
      const title = links[0].innerText.trim();
     execute(title)
    }
  });
}








// function saveAllVideoData() { 
//   let csvContent = 'Title,Channel Title,Comment Count,Likes Count,View Count,Date Published\n';
//    // Append each video data to the CSV content 
//   FinalResults.forEach(videoData => 
//   { csvContent += `${Object.values(videoData).join(',')}\n`;
//   });
    
//     // Save the CSV content to a file
//   const link = document.createElement('a'); link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent); 
//   link.download = 'video_statistics.csv'; 
//   link.click()
// }
