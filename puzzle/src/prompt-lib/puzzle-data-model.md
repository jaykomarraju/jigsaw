# Entities and Relationships

## 1. User
- **Attributes:**
  - user_id: UUID (PK)
  - wallet_address: VARCHAR(42) - Ethereum/Solana wallet address
  - created_at: TIMESTAMP
  - last_login: TIMESTAMP

## 2. Image
- **Attributes:**
  - image_id: UUID (PK)
  - user_id: UUID (FK)
  - original_file_name: VARCHAR(255)
  - file_size: INTEGER
  - mime_type: VARCHAR(50)
  - image_url: VARCHAR(255)
  - created_at: TIMESTAMP
  - status: ENUM('active', 'deleted')
  
## 3. Puzzle
- **Attributes:**
  - puzzle_id: UUID (PK)
  - image_id: UUID (FK)
  - user_id: UUID (FK)
  - grid_size: INTEGER
  - difficulty_level: ENUM('easy', 'medium', 'hard')
  - created_at: TIMESTAMP
  - status: ENUM('active', 'completed', 'abandoned')

## 4. PuzzlePiece
- **Attributes:**
  - piece_id: UUID (PK)
  - puzzle_id: UUID (FK)
  - position_index: INTEGER
  - current_x: FLOAT
  - current_y: FLOAT
  - correct_x: FLOAT
  - correct_y: FLOAT
  - width: INTEGER
  - height: INTEGER

## 5. GameSession
- **Attributes:**
  - session_id: UUID (PK)
  - puzzle_id: UUID (FK)
  - user_id: UUID (FK)
  - start_time: TIMESTAMP
  - end_time: TIMESTAMP
  - completion_time: INTEGER
  - moves_count: INTEGER
  - status: ENUM('in_progress', 'completed', 'abandoned')

## 6. PuzzleNFT
- **Attributes:**
  - nft_id: UUID (PK)
  - puzzle_id: UUID (FK)
  - user_id: UUID (FK)
  - token_id: VARCHAR(255)
  - contract_address: VARCHAR(42)
  - blockchain: ENUM('ethereum', 'solana')
  - completion_time: INTEGER
  - minted_at: TIMESTAMP
  - transaction_hash: VARCHAR(66)

# Relationships

1. **User to Image** (1:Many)
   - One user can upload many images
   - Each image belongs to one user

2. **Image to Puzzle** (1:Many)
   - One image can be used for multiple puzzles
   - Each puzzle is associated with one image

3. **Puzzle to PuzzlePiece** (1:Many)
   - One puzzle has many puzzle pieces
   - Each puzzle piece belongs to one puzzle

4. **User to GameSession** (1:Many)
   - One user can have many game sessions
   - Each game session belongs to one user

5. **Puzzle to GameSession** (1:Many)
   - One puzzle can have many game sessions
   - Each game session is associated with one puzzle

6. **User to PuzzleNFT** (1:Many)
   - One user can own many puzzle NFTs
   - Each puzzle NFT belongs to one user

7. **Puzzle to PuzzleNFT** (1:1)
   - One completed puzzle can be minted as one NFT
   - Each NFT represents one completed puzzle

# Indices and Constraints

1. **Primary Keys**
   - All entities use UUID as primary keys for scalability and security

2. **Foreign Keys**
   - Enforce referential integrity between related entities
   - Include cascade delete where appropriate

3. **Unique Constraints**
   - User wallet_address must be unique
   - NFT token_id must be unique per blockchain
   - Puzzle pieces must have unique position_index within a puzzle

4. **Check Constraints**
   - file_size must be <= 5MB (from MAX_FILE_SIZE constant)
   - grid_size must be > 0
   - completion_time must be >= 0
   - current_x and current_y must be within canvas bounds

# Data Types and Validation

1. **Images**
   - Only JPEG format accepted (from validateFile function)
   - Maximum file size: 5MB
   - Store images in external storage, database only contains URLs

2. **Coordinates**
   - Store as FLOAT for precise piece positioning
   - Must be within canvas bounds (0 to CANVAS_SIZE)

3. **Timestamps**
   - UTC timezone for consistency
   - Include creation and modification timestamps for audit trails

4. **Blockchain Data**
   - Wallet addresses: 42 chars for ETH, variable for SOL
   - Transaction hashes: 66 chars for ETH, variable for SOL
