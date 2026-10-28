# every front in level 530: name, door x, door y, direction the player faces (0 N, 1 E, 2 S, 3 W)
SITES = [
 ('plaza_tomb', 35, 30, 0), ('tomb536', 22, 2, 0), ('tomb537', 48, 2, 0), ('tomb538', 22, 67, 2), ('tomb539', 48, 67, 2),
 ('tomb540', 2, 20, 3), ('tomb541', 2, 50, 3), ('avenue_stair', 50, 22, 3), ('avenue_end', 52, 9, 0),
 ('maze1_red', 58, 6, 0), ('maze2_grey', 58, 63, 2), ('maze3_black', 12, 63, 2), ('maze4_pale', 12, 6, 0), ('lychgate', 68, 35, 1)]
D = {0: (0, 1), 1: (-1, 0), 2: (0, -1), 3: (1, 0)}   # stand this far in front of the door
def stand(x, y, f, d, side=0):
    dx, dy = D[f]; px, py = x + dx * d, y + dy * d
    if side: px, py = px + (dy != 0) * side, py + (dx != 0) * side
    return px, py
