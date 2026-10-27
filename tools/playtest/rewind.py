import sys,shutil,os
shutil.copy(os.path.join('saves','after_%s.json'%sys.argv[1]),'state.json');print('rewound to',sys.argv[1])
