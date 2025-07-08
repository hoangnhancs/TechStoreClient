using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContext2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_AspNetUsers_UserId",
                table: "Images");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Images",
                table: "Images");

            migrationBuilder.RenameTable(
                name: "Images",
                newName: "UserImages");

            migrationBuilder.RenameIndex(
                name: "IX_Images_UserId",
                table: "UserImages",
                newName: "IX_UserImages_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserImages",
                table: "UserImages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserImages_AspNetUsers_UserId",
                table: "UserImages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserImages_AspNetUsers_UserId",
                table: "UserImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserImages",
                table: "UserImages");

            migrationBuilder.RenameTable(
                name: "UserImages",
                newName: "Images");

            migrationBuilder.RenameIndex(
                name: "IX_UserImages_UserId",
                table: "Images",
                newName: "IX_Images_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Images",
                table: "Images",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_AspNetUsers_UserId",
                table: "Images",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
