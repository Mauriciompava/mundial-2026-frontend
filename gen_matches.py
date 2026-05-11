
groups = {
    'A': [610, 611, 612, 613],
    'B': [614, 615, 616, 617],
    'C': [618, 619, 620, 621],
    'D': [622, 623, 624, 625],
    'E': [626, 627, 628, 629],
    'F': [630, 631, 632, 633],
    'G': [634, 635, 636, 637],
    'H': [638, 639, 640, 641],
    'I': [642, 643, 644, 645],
    'J': [646, 647, 648, 649],
    'K': [650, 651, 652, 653],
    'L': [654, 655, 656, 657]
}

match_id = 222
all_matches = []

# Matchday 1
current_date = 11
current_hour = 20
for g_name, teams in groups.items():
    all_matches.append(f"({match_id},NULL,NULL,'2026-06-{current_date:02d} {current_hour:02d}:00:00.000000','SCHEDULED',{teams[1]},{teams[0]})")
    match_id += 1
    current_hour += 4
    if current_hour >= 24:
        current_hour -= 24
        current_date += 1
    
    all_matches.append(f"({match_id},NULL,NULL,'2026-06-{current_date:02d} {current_hour:02d}:00:00.000000','SCHEDULED',{teams[3]},{teams[2]})")
    match_id += 1
    current_hour += 4
    if current_hour >= 24:
        current_hour -= 24
        current_date += 1

# Matchday 2
current_date = 17
current_hour = 20
for g_name, teams in groups.items():
    all_matches.append(f"({match_id},NULL,NULL,'2026-06-{current_date:02d} {current_hour:02d}:00:00.000000','SCHEDULED',{teams[2]},{teams[0]})")
    match_id += 1
    current_hour += 4
    if current_hour >= 24:
        current_hour -= 24
        current_date += 1
    
    all_matches.append(f"({match_id},NULL,NULL,'2026-06-{current_date:02d} {current_hour:02d}:00:00.000000','SCHEDULED',{teams[3]},{teams[1]})")
    match_id += 1
    current_hour += 4
    if current_hour >= 24:
        current_hour -= 24
        current_date += 1

# Matchday 3
current_date = 23
current_hour = 20
for g_name, teams in groups.items():
    all_matches.append(f"({match_id},NULL,NULL,'2026-06-{current_date:02d} {current_hour:02d}:00:00.000000','SCHEDULED',{teams[3]},{teams[0]})")
    match_id += 1
    current_hour += 4
    if current_hour >= 24:
        current_hour -= 24
        current_date += 1
    
    all_matches.append(f"({match_id},NULL,NULL,'2026-06-{current_date:02d} {current_hour:02d}:00:00.000000','SCHEDULED',{teams[2]},{teams[1]})")
    match_id += 1
    current_hour += 4
    if current_hour >= 24:
        current_hour -= 24
        current_date += 1

# Wrap in Java string literal formatting
chunk_size = 5
print('            jdbcTemplate.execute("INSERT INTO matches (id, away_score, home_score, match_date, status, away_team_id, home_team_id) VALUES " +')
for i in range(0, len(all_matches), chunk_size):
    chunk = all_matches[i:i+chunk_size]
    if i + chunk_size < len(all_matches):
        print(f'                "{",".join(chunk)}," +')
    else:
        print(f'                "{",".join(chunk)}");')
