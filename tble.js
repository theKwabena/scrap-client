const contentDivs = document.querySelectorAll('.mdl-typography--body-1');
const first10Divs = Array.from(contentDivs).slice(0, 2);
const numberOfItems = 2;
let FinalResults = [];


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
    FinalResults.push(videodata)
    if(FinalResults.length == numberOfItems){
      saveAllVideoData()
    }
  },
  function(err) { console.error("Execute error", err); });
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
        const video_id = video.id.videoId
          



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
              FinalResults.push(videodata)
              if(FinalResults.length == numberOfItems){
                saveAllVideoData()
              }
              
                

            },


            function(err) { console.error("Execute error", err); });


      })  
              },



      function(err) { console.error("Execute error", err); });
  }


  gapi.load("client");



function generateExcel(statsdata){
  const worksheetData = statsdata.map(video=>{
    return [
    video.title,
    video.channelTitle,
    video.publishedAt,
    video.likeCount,
    video.viewCount.
    video.commentCount].join(',')
  });

  const csvContent = 'Title,Channel,DatePublished, Likes, Views, Comments\n' + worksheetData.join('\n');
  saveFile(csvContent, 'video-data')
  
  // const workbook = XLSX.utils.book_new();
  // const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  // XLSX.utils.book.append_sheet(workbook, worksheet, 'video-stats')
  // XLSX.writefile(workbook, 'video_statistics_dded')
}







function saveFile(content, filename){
  const encoded = encodeURIComponent(content)
  const link = document.createElement('a');
  link.href='data:text/csv;charset=utf-8,' + encoded
  link.download = filename;
  link.click();
}








function scrap(){
  first10Divs.forEach((div) => {
    const links = div.querySelectorAll('a');
    if (links.length >= 2) {
      const title = links[0].innerText.trim();
      execute(title)
      
    }
  });

}








function saveAllVideoData() { 
  let csvContent = 'Title,Channel Title,Comment Count,Likes Count,View Count,Date Published\n';
   // Append each video data to the CSV content 
   FinalResults.forEach(videoData => 
    { csvContent += `${Object.values(videoData).join(',')}\n`;
     });
    // Save the CSV content to a file
     const link = document.createElement('a'); link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent); 
     link.download = 'video_statistics.csv'; 
     link.click()
    }
