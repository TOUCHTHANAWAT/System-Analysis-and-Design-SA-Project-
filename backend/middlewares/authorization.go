package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"example.com/project/services" // ใช้ในการถอดรหัส JWT
)

func Authorizes() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		// ตรวจสอบว่า token มีคำว่า "Bearer " ขึ้นต้นหรือไม่
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		// ถอดรหัส JWT token
		jwtWrapper := services.JwtWrapper{
			SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		}
		claims, err := jwtWrapper.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// ถอดรหัสสำเร็จ - ส่งข้อมูล user จาก token ไปยัง handler
		c.Set("user", claims.Email) // หรือ id แล้วแต่ข้อมูลที่เก็บใน token
		c.Next()
	}
}
