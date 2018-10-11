## Marc Reardon / Cox Orb Practice Evaluator

The "COX Orb" is a mechanical device that records location, time, and other data, similar to
a GPS. The WPI Rowing Team uses the COX Orb to record practice/race data. The full list
of the data it records is here:
  { Longitude,
  Latitude,
  Time of Day,
  Elapsed time,
  Speed (split/500meters),
  Speed (meters/second),
  Total Distance,
  Distance per Stroke,
  Strokes per minute,
  Check Factor (smoothness of stoke),
  Total Stroke Count }

The data is viewable via .csv and .gpx files which are extracted from the COX Orb, but there is no graphical way to visualize the data so it is difficult to analyze after practice.

To solve this problem, the COX Orb Practice Evaluator does the following:
- Parses the .gpx and .csv files and stores the data.
- Plots the path on google maps
- Shows the data at any given point:
   - Speed (split/500meters)
   - Strokes per minute

The average stats are reported to the user:
- Speed (split/500meters)
- Speed (meters/second)
- Total Distance
- Distance per Stroke
- Strokes per minute
- Check Factor (smoothness of stroke)
- Total Stroke Count

#### There are sample .gpx and .csv files in the SAMPLE_FILES folder. Use corresponding files: Quinsigamond.gpx -> Quinsigamond.csv, Riverfront.gpx -> Riverfront.csv

## Technical Achievements
- **Tech Achievement 1**: React.js - re-worked entire framework of the project to use components in React so that development and updating map data would be easier.
- **Tech Achievement 2**: Express - first time implementation of express in server.js made server-side developing faster.
- **Tech Achievement 3**: Google Maps API - The user can see a gps path and data in google maps. This helps with visualization, as spreadsheet data-points are not easy to visualize.

### Design/Evaluation Achievements
- **Design Achievement 1**: Shown in `style.css`, the customized infowindows in google maps allows the user to see the data they care about (split and stroke rate) along the path.
- **Design Achievement 2**: I tested the app with my coaches and coxswains and they wanted to see their 'course' (the path they steered), so I created a toggle option for the data on the map. It is easier to see the path when the data is hidden. The coaches wanted to see the averages of the data, so the app computes the averages of all fields and shows the user.
